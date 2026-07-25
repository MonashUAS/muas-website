#!/usr/bin/env node
/**
 * Full public image audit: classify, resize, convert opaque photo PNGs to JPEG,
 * shrink logos (preserve alpha), delete unused RAW. Skips parallax/animation frames.
 *
 * Usage: node scripts/optimize-images.mjs
 * Writes scripts/image-conversions.json for any PNG→JPEG path updates.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const PUBLIC_IMAGES = path.join(PUBLIC, "images");
const PUBLIC_LOGOS = path.join(PUBLIC, "logos");
const CONVERSIONS_PATH = path.join(ROOT, "scripts", "image-conversions.json");

const JPEG_QUALITY = 81;
const PNG_COMPRESSION = 9;

const SKIP_DIR_PARTS = [
  `${path.sep}homepage${path.sep}redback-parallax${path.sep}`,
  `${path.sep}redback-animation${path.sep}`,
  `${path.sep}scroll-hero${path.sep}`,
  `${path.sep}frames${path.sep}`,
];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"]);

/** Alpha graphics that must stay PNG even if photographic-looking. */
const KEEP_ALPHA_BASENAMES = new Set([
  "dna.png",
  "timeline-web-field.png",
  "timeline-web-spire.png",
  "timeline-web-arc.png",
  "redback-loading.png",
  "redback.png",
  "ibis.png",
  "albatross.png",
  "peregrine.png",
]);

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function classify(filePath) {
  const rel = path.relative(PUBLIC, filePath).replaceAll("\\", "/");
  const base = path.basename(filePath).toLowerCase();
  const dir = path.dirname(rel).toLowerCase();

  if (dir.includes("headshots")) {
    return { kind: "headshot", maxEdge: 768, forceJpeg: true };
  }

  if (dir.includes("sponsors") || dir.startsWith("logos")) {
    return { kind: "logo", maxEdge: 720, forceJpeg: false };
  }

  if (
    KEEP_ALPHA_BASENAMES.has(base) ||
    base.includes("timeline-web") ||
    base === "dna.png"
  ) {
    return { kind: "alphaGraphic", maxEdge: 1200, forceJpeg: false };
  }

  // Small branded cutouts under drones (not gallery photos)
  if (
    dir.startsWith("images/drones") &&
    base.endsWith(".png") &&
    !base.includes("hero") &&
    !/\d/.test(base.replace(/\.png$/, ""))
  ) {
    return { kind: "alphaGraphic", maxEdge: 1200, forceJpeg: false };
  }

  if (
    dir.includes("/hero") ||
    dir.includes("homepage/hero") ||
    dir.includes("homepage/quick-nav") ||
    dir.includes("homepage/sections")
  ) {
    return { kind: "hero", maxEdge: 1920, forceJpeg: true };
  }

  if (dir.includes("/projects") || dir.includes("redback-projects")) {
    return { kind: "carousel", maxEdge: 1600, forceJpeg: true };
  }

  if (dir.startsWith("images/drones")) {
    return { kind: "gallery", maxEdge: 1600, forceJpeg: true };
  }

  return { kind: "photo", maxEdge: 1600, forceJpeg: true };
}

async function walk(dir, files = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await walk(fullPath, files);
      continue;
    }

    const ext = path.extname(entry.name);
    if (!IMAGE_EXT.has(ext)) continue;
    if (SKIP_DIR_PARTS.some((part) => fullPath.includes(part))) continue;

    files.push(fullPath);
  }

  return files;
}

async function deleteRawFiles() {
  const rawFiles = [];

  async function walkRaw(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walkRaw(fullPath);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === ".cr2" || ext === ".cr3") {
        rawFiles.push(fullPath);
      }
    }
  }

  await walkRaw(PUBLIC);
  let bytes = 0;
  for (const file of rawFiles) {
    const stat = await fs.stat(file);
    bytes += stat.size;
    await fs.unlink(file);
    console.log(`Deleted RAW ${path.relative(ROOT, file)} (${formatBytes(stat.size)})`);
  }
  return { count: rawFiles.length, bytes };
}

async function hasMeaningfulAlpha(meta, imageBuffer) {
  if (meta.hasAlpha !== true) return false;
  // Sample: if almost fully opaque, treat as opaque photo PNG.
  const { data, info } = await sharp(imageBuffer, { failOn: "none" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  if (channels < 4) return false;

  let transparentish = 0;
  const step = Math.max(1, Math.floor(info.width * info.height / 8000));
  for (let i = 0; i < info.width * info.height; i += step) {
    const alpha = data[i * channels + 3];
    if (alpha < 250) transparentish += 1;
  }

  return transparentish > 20;
}

async function resizePipeline(image, width, height, maxEdge) {
  const longEdge = Math.max(width, height);
  if (longEdge <= maxEdge) return image;
  return image.resize({
    width: width >= height ? maxEdge : undefined,
    height: height > width ? maxEdge : undefined,
    fit: "inside",
    withoutEnlargement: true,
  });
}

async function optimizeFile(filePath, conversions) {
  const stat = await fs.stat(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const input = await fs.readFile(filePath);
  const meta = await sharp(input, { failOn: "none" }).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const { kind, maxEdge, forceJpeg } = classify(filePath);

  const meaningfulAlpha =
    ext === ".png" ? await hasMeaningfulAlpha(meta, input) : false;

  const shouldConvertToJpeg =
    forceJpeg &&
    ext === ".png" &&
    !meaningfulAlpha &&
    kind !== "logo" &&
    kind !== "alphaGraphic";

  let pipeline = sharp(input, { failOn: "none" }).rotate();
  pipeline = await resizePipeline(pipeline, width, height, maxEdge);

  let outputPath = filePath;
  let output;

  // Logo JPEGs: width-cap then recompress as JPEG.
  if (kind === "logo" && ext !== ".png") {
    if (width > maxEdge) {
      pipeline = sharp(input, { failOn: "none" })
        .rotate()
        .resize({ width: maxEdge, withoutEnlargement: true });
    }
    output = await pipeline
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer();
  } else if (shouldConvertToJpeg) {
    output = await pipeline
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer();
    outputPath = filePath.replace(/\.png$/i, ".jpg");
  } else if (ext === ".png") {
    if (kind === "logo" && width > maxEdge) {
      pipeline = sharp(input, { failOn: "none" })
        .rotate()
        .resize({ width: maxEdge, withoutEnlargement: true });
    }
    output = await pipeline
      .png({ compressionLevel: PNG_COMPRESSION, palette: false })
      .toBuffer();
  } else {
    output = await pipeline
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer();
  }

  const longEdge = Math.max(width, height);
  if (output.length >= stat.size && longEdge <= maxEdge && outputPath === filePath) {
    return { skipped: true, before: stat.size, after: stat.size, kind };
  }

  await fs.writeFile(outputPath, output);
  if (outputPath !== filePath) {
    await fs.unlink(filePath);
    const from = "/" + path.relative(PUBLIC, filePath).replaceAll("\\", "/");
    const to = "/" + path.relative(PUBLIC, outputPath).replaceAll("\\", "/");
    conversions[from] = to;
  }

  return {
    skipped: false,
    before: stat.size,
    after: output.length,
    kind,
    converted: outputPath !== filePath,
    filePath: outputPath,
    fromPath: filePath,
  };
}

async function sumImageBytes(rootDir) {
  const files = await walk(rootDir, []);
  // Also include logos
  if (rootDir === PUBLIC_IMAGES) {
    await walk(PUBLIC_LOGOS, files);
  }
  let total = 0;
  for (const file of files) {
    total += (await fs.stat(file)).size;
  }
  return { total, count: files.length };
}

async function main() {
  const beforeOpt = await sumImageBytes(PUBLIC_IMAGES);
  // Manual before for optimizable only
  console.log(
    `BEFORE optimisable images: ${formatBytes(beforeOpt.total)} (${beforeOpt.count} files)`,
  );

  const rawResult = await deleteRawFiles();
  console.log(
    `Deleted ${rawResult.count} RAW files (${formatBytes(rawResult.bytes)})\n`,
  );

  const files = await walk(PUBLIC_IMAGES);
  await walk(PUBLIC_LOGOS, files);

  const conversions = {};
  let saved = 0;
  let processed = 0;

  for (const filePath of files) {
    try {
      const result = await optimizeFile(filePath, conversions);
      if (!result || result.skipped) continue;

      processed += 1;
      saved += result.before - result.after;
      const rel = path.relative(ROOT, result.fromPath ?? result.filePath);
      const note = result.converted ? " → JPEG" : "";
      console.log(
        `[${result.kind}] ${rel}: ${formatBytes(result.before)} → ${formatBytes(result.after)}${note}`,
      );
    } catch (error) {
      console.error(`Failed: ${filePath}`, error);
    }
  }

  await fs.writeFile(CONVERSIONS_PATH, JSON.stringify(conversions, null, 2));

  const afterOpt = await sumImageBytes(PUBLIC_IMAGES);
  console.log(
    `\nOptimized ${processed} files, saved ${formatBytes(saved)} on rewritten assets.`,
  );
  console.log(
    `AFTER optimisable images: ${formatBytes(afterOpt.total)} (${afterOpt.count} files)`,
  );
  console.log(
    `PNG→JPEG conversions: ${Object.keys(conversions).length} (see scripts/image-conversions.json)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
