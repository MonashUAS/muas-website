#!/usr/bin/env node
/**
 * Script to batch convert static PNG and JPG/JPEG images in /public into compressed .webp format,
 * update codebase references in /src, and remove superseded source image files.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const SRC_DIR = path.join(ROOT_DIR, "src");

const TARGET_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

/** Standard browser icon files to retain as PNG. */
const FAVICON_EXCLUSIONS = new Set([
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
]);

/**
 * Formats a byte size into human readable string.
 * @param {number} bytes - Number of bytes.
 * @returns {string} Formatted string.
 */
function formatByteSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Recursively retrieves all file paths within a directory.
 * @param {string} directory - Directory path to traverse.
 * @param {Array<string>} [fileList=[]] - Accumulated list of files.
 * @returns {Promise<Array<string>>} Array of absolute file paths.
 */
async function walkDirectory(directory, fileList = []) {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch {
    return fileList;
  }

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walkDirectory(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

/**
 * Determines whether a file should be skipped during conversion.
 * @param {string} filePath - Absolute path to the file.
 * @returns {boolean} True if the file should be skipped.
 */
function shouldSkipFile(filePath) {
  const filename = path.basename(filePath);
  if (FAVICON_EXCLUSIONS.has(filename)) return true;

  const ext = path.extname(filePath).toLowerCase();
  return !TARGET_EXTENSIONS.has(ext);
}

/**
 * Converts a raster image file to .webp using sharp.
 * @param {string} filePath - Absolute path of original image.
 * @returns {Promise<{from: string, to: string, beforeSize: number, afterSize: number}>} Conversion result metadata.
 */
async function convertToWebp(filePath) {
  const stat = await fs.stat(filePath);
  const beforeSize = stat.size;
  const webpPath = filePath.replace(/\.(jpe?g|png)$/i, ".webp");

  const inputBuffer = await fs.readFile(filePath);
  const image = sharp(inputBuffer, { failOn: "none" }).rotate();
  const metadata = await image.metadata();

  const isPng = path.extname(filePath).toLowerCase() === ".png";
  const hasAlpha = metadata.hasAlpha ?? false;

  const outputBuffer = await image
    .webp({
      quality: isPng ? 90 : 84,
      alphaQuality: hasAlpha ? 96 : 100,
      effort: 5,
      smartSubsample: true,
    })
    .toBuffer();

  await fs.writeFile(webpPath, outputBuffer);

  const relativeFrom = "/" + path.relative(PUBLIC_DIR, filePath).replaceAll("\\", "/");
  const relativeTo = "/" + path.relative(PUBLIC_DIR, webpPath).replaceAll("\\", "/");

  return {
    from: relativeFrom,
    to: relativeTo,
    fromPath: filePath,
    toPath: webpPath,
    beforeSize,
    afterSize: outputBuffer.length,
  };
}

/**
 * Updates references to converted files across source files in /src.
 * @param {Array<{from: string, to: string}>} conversions - Array of conversion metadata.
 * @returns {Promise<number>} Count of modified files.
 */
async function updateSourceReferences(conversions) {
  const sourceFiles = await walkDirectory(SRC_DIR);
  const codeFiles = sourceFiles.filter((file) =>
    /\.(ts|tsx|js|jsx|json|css|scss|md)$/.test(file)
  );

  let updatedCount = 0;

  for (const file of codeFiles) {
    let content = await fs.readFile(file, "utf8");
    const originalContent = content;

    for (const conversion of conversions) {
      // Replace exact web path reference (e.g. /images/drones/peregrine/peregrine-1.jpg)
      content = content.replaceAll(conversion.from, conversion.to);

      // Replace basename reference if unique
      const oldBasename = path.basename(conversion.from);
      const newBasename = path.basename(conversion.to);
      content = content.replaceAll(oldBasename, newBasename);
    }

    if (content !== originalContent) {
      await fs.writeFile(file, content, "utf8");
      updatedCount++;
      console.log(`Updated references in: ${path.relative(ROOT_DIR, file)}`);
    }
  }

  return updatedCount;
}

/**
 * Deletes original JPG/PNG files that have been successfully converted to WebP.
 * @param {Array<{fromPath: string, toPath: string}>} conversions - Array of conversion metadata.
 * @returns {Promise<number>} Count of deleted original files.
 */
async function cleanupOriginals(conversions) {
  let deletedCount = 0;

  for (const conversion of conversions) {
    if (conversion.fromPath !== conversion.toPath) {
      try {
        await fs.unlink(conversion.fromPath);
        deletedCount++;
      } catch (err) {
        console.warn(`Could not delete original file ${conversion.fromPath}:`, err);
      }
    }
  }

  return deletedCount;
}

/**
 * Main execution function for image conversion script.
 */
async function main() {
  console.log("Starting WebP image conversion processing...");
  const publicFiles = await walkDirectory(PUBLIC_DIR);
  const targetFiles = publicFiles.filter((file) => !shouldSkipFile(file));

  console.log(`Found ${targetFiles.length} target PNG/JPG image(s) to convert to WebP.\n`);

  const conversions = [];
  let totalSavedBytes = 0;

  for (const file of targetFiles) {
    try {
      const result = await convertToWebp(file);
      conversions.push(result);
      const saved = result.beforeSize - result.afterSize;
      totalSavedBytes += saved;
      console.log(
        `Converted: ${result.from} -> ${result.to} (${formatByteSize(result.beforeSize)} -> ${formatByteSize(result.afterSize)})`
      );
    } catch (err) {
      console.error(`Failed to convert ${file}:`, err);
    }
  }

  if (conversions.length > 0) {
    console.log("\nUpdating codebase references in /src...");
    const updatedFiles = await updateSourceReferences(conversions);
    console.log(`Updated ${updatedFiles} source file(s).`);

    console.log("\nCleaning up superseded original JPG/PNG assets...");
    const deletedFiles = await cleanupOriginals(conversions);
    console.log(`Removed ${deletedFiles} original file(s).`);
  }

  console.log(`\nWebP conversion finished. Total space saved: ${formatByteSize(totalSavedBytes)}`);
}

main().catch((err) => {
  console.error("Error during WebP conversion script execution:", err);
  process.exit(1);
});
