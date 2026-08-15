import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/**
 * Converts all newsletter cover images and page spreads to WebP format with quality optimization.
 * Removes old JPG files once converted.
 */
async function convertAllToWebP() {
  const publicDir = path.resolve(process.cwd(), "public");
  const newslettersDir = path.join(publicDir, "newsletters");
  const coversDir = path.join(newslettersDir, "covers");
  const pagesDir = path.join(newslettersDir, "pages");

  // 1. Convert Covers
  const coverFiles = fs.readdirSync(coversDir);
  for (const file of coverFiles) {
    if (file.endsWith(".jpg")) {
      const jpgPath = path.join(coversDir, file);
      const webpPath = path.join(coversDir, file.replace(".jpg", ".webp"));
      await sharp(jpgPath).webp({ quality: 82, effort: 4 }).toFile(webpPath);
      fs.unlinkSync(jpgPath);
      console.log(`Converted cover: ${file} -> ${path.basename(webpPath)}`);
    }
  }

  // 2. Convert Page Spreads
  const itemDirs = fs.readdirSync(pagesDir);
  for (const itemDirName of itemDirs) {
    const itemDirPath = path.join(pagesDir, itemDirName);
    if (fs.statSync(itemDirPath).isDirectory()) {
      const pageFiles = fs.readdirSync(itemDirPath);
      for (const pageFile of pageFiles) {
        if (pageFile.endsWith(".jpg")) {
          const jpgPath = path.join(itemDirPath, pageFile);
          const webpPath = path.join(itemDirPath, pageFile.replace(".jpg", ".webp"));
          await sharp(jpgPath).webp({ quality: 80, effort: 4 }).toFile(webpPath);
          fs.unlinkSync(jpgPath);
        }
      }
      console.log(`Converted all pages in ${itemDirName} to WebP.`);
    }
  }

  console.log("WebP conversion completed for all newsletters.");
}

convertAllToWebP()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error during WebP conversion:", err);
    process.exit(1);
  });
