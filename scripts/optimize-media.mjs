#!/usr/bin/env node
/**
 * Optimises referenced website media:
 * - Converts suitable public raster images to WebP.
 * - Transcodes MOV hero/media clips to MP4 and recompresses oversized MP4s.
 * - Generates WebP posters beside final MP4 files.
 * - Rewrites src/ references and records a before/after report.
 *
 * Intentionally skips scroll/frame-sequence directories.
 */
import childProcess from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const REPORT_PATH = path.join(ROOT, "scripts", "media-optimization-report.json");
const SOURCE_ROOTS = [path.join(ROOT, "src")];
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
const VIDEO_EXTENSIONS = new Set([".mov", ".mp4"]);
const SKIP_DIR_PARTS = [
  `${path.sep}homepage${path.sep}redback-parallax${path.sep}`,
  `${path.sep}redback-animation${path.sep}`,
  `${path.sep}scroll-hero${path.sep}`,
  `${path.sep}frames${path.sep}`,
];
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
  "mosquito.png",
  "hydra.png",
  "kraken.png",
]);

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

function toPublicRef(filePath) {
  return `/${path.relative(PUBLIC, filePath).replaceAll(path.sep, "/")}`;
}

function fromPublicRef(publicRef) {
  return path.join(PUBLIC, decodeURIComponent(publicRef.replace(/^\//, "")));
}

async function walk(dir, predicate, files = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await walk(fullPath, predicate, files);
      continue;
    }

    if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function shouldSkipFile(filePath) {
  return (
    SKIP_DIR_PARTS.some((part) => filePath.includes(part)) ||
    filePath.includes(`${path.sep}favicon${path.sep}`)
  );
}

function classifyImage(filePath) {
  const rel = path.relative(PUBLIC, filePath).replaceAll(path.sep, "/");
  const base = path.basename(filePath).toLowerCase();
  const dir = path.dirname(rel).toLowerCase();

  if (dir.includes("headshots")) {
    return { kind: "headshot", maxEdge: 768, quality: 82 };
  }

  if (dir.includes("sponsors") || dir.startsWith("logos")) {
    return { kind: "logo", maxEdge: 720, quality: 92 };
  }

  if (
    KEEP_ALPHA_BASENAMES.has(base) ||
    base.includes("timeline-web") ||
    base === "false.png"
  ) {
    return { kind: "alphaGraphic", maxEdge: 1200, quality: 92 };
  }

  if (
    dir.includes("/hero") ||
    dir.includes("homepage/hero") ||
    dir.includes("homepage/quick-nav") ||
    dir.includes("homepage/sections")
  ) {
    return { kind: "hero", maxEdge: 1920, quality: 84 };
  }

  if (
    dir.includes("/projects") ||
    dir.includes("redback-projects") ||
    dir.includes("technical specifications")
  ) {
    return { kind: "carousel", maxEdge: 1600, quality: 82 };
  }

  if (dir.startsWith("images/drones")) {
    return { kind: "drone", maxEdge: 1600, quality: 84 };
  }

  return { kind: "photo", maxEdge: 1600, quality: 82 };
}

async function hasMeaningfulAlpha(meta, input) {
  if (meta.hasAlpha !== true) return false;

  const { data, info } = await sharp(input, { failOn: "none" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (info.channels < 4) return false;

  let transparentish = 0;
  const sampleStep = Math.max(1, Math.floor((info.width * info.height) / 8000));

  for (let pixelIndex = 0; pixelIndex < info.width * info.height; pixelIndex += sampleStep) {
    const alpha = data[pixelIndex * info.channels + 3];
    if (alpha < 250) transparentish += 1;
  }

  return transparentish > 20;
}

async function optimiseImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const before = (await fs.stat(filePath)).size;
  const input = await fs.readFile(filePath);
  const meta = await sharp(input, { failOn: "none" }).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const config = classifyImage(filePath);
  const alpha = ext === ".png" ? await hasMeaningfulAlpha(meta, input) : false;
  const outputPath = filePath.replace(/\.(jpe?g|png)$/i, ".webp");

  let pipeline = sharp(input, { failOn: "none" }).rotate();

  if (Math.max(width, height) > config.maxEdge) {
    pipeline = pipeline.resize({
      width: width >= height ? config.maxEdge : undefined,
      height: height > width ? config.maxEdge : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const output = await pipeline
    .webp({
      quality: config.quality,
      alphaQuality: alpha ? 96 : 100,
      effort: 5,
      smartSubsample: true,
    })
    .toBuffer();

  if (output.length >= before * 0.97) {
    return {
      converted: false,
      kind: config.kind,
      from: toPublicRef(filePath),
      before,
      after: before,
      reason: "webp-not-smaller",
    };
  }

  await fs.writeFile(outputPath, output);

  return {
    converted: true,
    kind: config.kind,
    from: toPublicRef(filePath),
    to: toPublicRef(outputPath),
    before,
    after: output.length,
    dimensionsBefore: width && height ? `${width}x${height}` : undefined,
  };
}

function run(command, args) {
  childProcess.execFileSync(command, args, {
    cwd: ROOT,
    stdio: ["ignore", "ignore", "pipe"],
  });
}

async function optimiseVideo(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const before = (await fs.stat(filePath)).size;
  const outputPath =
    ext === ".mov"
      ? filePath.replace(/\.mov$/i, ".mp4")
      : filePath.replace(/\.mp4$/i, ".tmp-optimized.mp4");

  run("ffmpeg", [
    "-y",
    "-i",
    filePath,
    "-map",
    "0:v:0",
    "-vf",
    "scale='min(1920,iw)':-2",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "28",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    outputPath,
  ]);

  const outputSize = (await fs.stat(outputPath)).size;

  if (ext === ".mp4" && outputSize >= before * 0.98) {
    await fs.unlink(outputPath);
    await generateVideoPoster(filePath);
    return {
      converted: false,
      from: toPublicRef(filePath),
      before,
      after: before,
      reason: "mp4-not-smaller",
      poster: getPosterRef(filePath),
    };
  }

  if (ext === ".mp4") {
    await fs.rename(outputPath, filePath);
    await generateVideoPoster(filePath);
    return {
      converted: true,
      from: toPublicRef(filePath),
      to: toPublicRef(filePath),
      before,
      after: outputSize,
      poster: getPosterRef(filePath),
    };
  }

  await generateVideoPoster(outputPath);

  return {
    converted: true,
    from: toPublicRef(filePath),
    to: toPublicRef(outputPath),
    before,
    after: outputSize,
    poster: getPosterRef(outputPath),
  };
}

function getPosterPath(videoPath) {
  return videoPath.replace(/\.[^/.]+$/, "-poster.webp");
}

function getPosterRef(videoPath) {
  return toPublicRef(getPosterPath(videoPath));
}

async function generateVideoPoster(videoPath) {
  const posterPath = getPosterPath(videoPath);
  const tempPosterPath = posterPath.replace(/\.webp$/i, ".tmp.jpg");

  run("ffmpeg", [
    "-y",
    "-ss",
    "0.35",
    "-i",
    videoPath,
    "-frames:v",
    "1",
    "-vf",
    "scale='min(1280,iw)':-2",
    "-q:v",
    "3",
    tempPosterPath,
  ]);

  const posterBuffer = await sharp(tempPosterPath, { failOn: "none" })
    .webp({ quality: 78, effort: 5, smartSubsample: true })
    .toBuffer();

  await fs.writeFile(posterPath, posterBuffer);
  await fs.unlink(tempPosterPath);
}

async function readSourceFiles() {
  const files = [];

  for (const sourceRoot of SOURCE_ROOTS) {
    await walk(
      sourceRoot,
      (filePath) => /\.(ts|tsx|js|jsx|md|json)$/.test(filePath),
      files,
    );
  }

  return files;
}

async function rewriteSourceReferences(conversions) {
  const sourceFiles = await readSourceFiles();
  const basenameCounts = new Map();

  for (const conversion of conversions) {
    const basename = path.basename(conversion.from);
    basenameCounts.set(basename, (basenameCounts.get(basename) ?? 0) + 1);
  }

  const rewrittenFiles = [];

  for (const filePath of sourceFiles) {
    let source = await fs.readFile(filePath, "utf8");
    const originalSource = source;

    for (const conversion of conversions) {
      if (!conversion.to) continue;

      source = source.split(conversion.from).join(conversion.to);

      const oldBasename = path.basename(conversion.from);
      const newBasename = path.basename(conversion.to);

      if (basenameCounts.get(oldBasename) === 1) {
        source = source.split(oldBasename).join(newBasename);
      }
    }

    if (source !== originalSource) {
      await fs.writeFile(filePath, source);
      rewrittenFiles.push(path.relative(ROOT, filePath));
    }
  }

  return rewrittenFiles;
}

async function removeSupersededOriginals(conversions) {
  const sourceFiles = await readSourceFiles();
  const sourceText = (
    await Promise.all(sourceFiles.map((filePath) => fs.readFile(filePath, "utf8")))
  ).join("\n");
  const removed = [];

  for (const conversion of conversions) {
    if (!conversion.to || conversion.from === conversion.to) continue;

    const fromPath = fromPublicRef(conversion.from);
    const oldBasename = path.basename(conversion.from);

    if (sourceText.includes(conversion.from) || sourceText.includes(oldBasename)) {
      continue;
    }

    try {
      const size = (await fs.stat(fromPath)).size;
      await fs.unlink(fromPath);
      removed.push({ path: conversion.from, size });
    } catch {
      // Already gone or not available.
    }
  }

  return removed;
}

async function removeKnownStaleMedia() {
  const staleRefs = [
    "/videos/placeholder-vid.mov",
    "/videos/placeholder-vid.mp4",
    "/videos/placeholder-vid-poster.webp",
  ];
  const sourceFiles = await readSourceFiles();
  const sourceText = (
    await Promise.all(sourceFiles.map((filePath) => fs.readFile(filePath, "utf8")))
  ).join("\n");
  const removed = [];

  for (const staleRef of staleRefs) {
    if (sourceText.includes(staleRef) || sourceText.includes(path.basename(staleRef))) {
      continue;
    }

    const stalePath = fromPublicRef(staleRef);

    try {
      const size = (await fs.stat(stalePath)).size;
      await fs.unlink(stalePath);
      removed.push({ path: staleRef, size });
    } catch {
      // No stale file present.
    }
  }

  return removed;
}

async function collectPublicRefs() {
  const sourceFiles = await readSourceFiles();
  const refs = new Set();
  const pattern = /["'`]((?:\/)(?:images|videos|models|logos|favicon)[^"'`)]*)["'`]/g;

  for (const filePath of sourceFiles) {
    const source = await fs.readFile(filePath, "utf8");
    let match;

    while ((match = pattern.exec(source))) {
      refs.add(match[1].split("?")[0]);
    }
  }

  return refs;
}

async function validatePublicRefs(videoResults) {
  const refs = await collectPublicRefs();
  const missing = [];

  for (const ref of refs) {
    try {
      await fs.access(fromPublicRef(ref));
    } catch {
      missing.push(ref);
    }
  }

  for (const result of videoResults) {
    if (!result.poster) continue;
    try {
      await fs.access(fromPublicRef(result.poster));
    } catch {
      missing.push(result.poster);
    }
  }

  return missing;
}

async function sumFiles(files) {
  let total = 0;

  for (const file of files) {
    total += (await fs.stat(file)).size;
  }

  return total;
}

async function main() {
  const imageFiles = await walk(
    PUBLIC,
    (filePath) =>
      !shouldSkipFile(filePath) &&
      IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase()) &&
      !path.basename(filePath).endsWith("-poster.webp"),
  );
  let videoFiles = await walk(
    PUBLIC,
    (filePath) =>
      !shouldSkipFile(filePath) &&
      VIDEO_EXTENSIONS.has(path.extname(filePath).toLowerCase()) &&
      !path.basename(filePath).includes(".tmp-optimized") &&
      !path.basename(filePath).startsWith("placeholder-vid"),
  );
  const videoFileSet = new Set(videoFiles);
  videoFiles = videoFiles.filter((filePath) => {
    if (path.extname(filePath).toLowerCase() !== ".mp4") {
      return true;
    }

    return !videoFileSet.has(filePath.replace(/\.mp4$/i, ".mov"));
  });
  const imageTotalBefore = await sumFiles(imageFiles);
  const videoTotalBefore = await sumFiles(videoFiles);
  const imageResults = [];
  const videoResults = [];

  for (const imageFile of imageFiles) {
    try {
      const result = await optimiseImage(imageFile);
      imageResults.push(result);
      if (result.converted) {
        console.log(
          `[image:${result.kind}] ${result.from} -> ${result.to} ${formatBytes(result.before)} -> ${formatBytes(result.after)}`,
        );
      }
    } catch (error) {
      imageResults.push({
        converted: false,
        from: toPublicRef(imageFile),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  for (const videoFile of videoFiles) {
    try {
      const result = await optimiseVideo(videoFile);
      videoResults.push(result);
      if (result.converted) {
        console.log(
          `[video] ${result.from} -> ${result.to} ${formatBytes(result.before)} -> ${formatBytes(result.after)}`,
        );
      }
    } catch (error) {
      videoResults.push({
        converted: false,
        from: toPublicRef(videoFile),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const conversions = [
    ...imageResults.filter((result) => result.converted),
    ...videoResults.filter((result) => result.converted && result.to !== result.from),
  ];
  const rewrittenFiles = await rewriteSourceReferences(conversions);
  const removedSuperseded = await removeSupersededOriginals(conversions);
  const removedStale = await removeKnownStaleMedia();
  const missingRefs = await validatePublicRefs(videoResults);

  const finalImageFiles = await walk(
    PUBLIC,
    (filePath) =>
      !shouldSkipFile(filePath) &&
      [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(
        path.extname(filePath).toLowerCase(),
      ),
  );
  const finalVideoFiles = await walk(
    PUBLIC,
    (filePath) =>
      !shouldSkipFile(filePath) &&
      VIDEO_EXTENSIONS.has(path.extname(filePath).toLowerCase()),
  );
  const imageTotalAfter = await sumFiles(finalImageFiles);
  const videoTotalAfter = await sumFiles(finalVideoFiles);

  const report = {
    generatedAt: new Date().toISOString(),
    imageTotals: {
      before: imageTotalBefore,
      after: imageTotalAfter,
      saved: imageTotalBefore - imageTotalAfter,
    },
    videoTotals: {
      before: videoTotalBefore,
      after: videoTotalAfter,
      saved: videoTotalBefore - videoTotalAfter,
    },
    imageResults,
    videoResults,
    rewrittenFiles,
    removedSuperseded,
    removedStale,
    missingRefs,
  };

  await fs.writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  console.log(
    `Images: ${formatBytes(imageTotalBefore)} -> ${formatBytes(imageTotalAfter)} (${formatBytes(report.imageTotals.saved)} saved)`,
  );
  console.log(
    `Videos: ${formatBytes(videoTotalBefore)} -> ${formatBytes(videoTotalAfter)} (${formatBytes(report.videoTotals.saved)} saved)`,
  );
  console.log(`Rewritten files: ${rewrittenFiles.length}`);
  console.log(`Removed superseded originals: ${removedSuperseded.length}`);
  console.log(`Removed stale files: ${removedStale.length}`);

  if (missingRefs.length > 0) {
    console.error(`Missing public refs:\n${missingRefs.join("\n")}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
