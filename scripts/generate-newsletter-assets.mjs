import fs from "node:fs";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import sharp from "sharp";

/**
 * Pre-renders PDF newsletter covers and page spreads into optimized WebP images.
 * Scans public/newsletters for any PDF files (e.g., newsletter-6.pdf), extracts all page images
 * to public/newsletters/pages/[id]/ and public/newsletters/covers/[id].webp, and prints out
 * the configuration snippet for src/app/newsletter/newsletter-data.ts.
 */
async function generateNewsletterAssets() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const publicDir = path.resolve(process.cwd(), "public");
  const newslettersDir = path.join(publicDir, "newsletters");
  const coversDir = path.join(newslettersDir, "covers");
  const pagesDir = path.join(newslettersDir, "pages");

  const pdfsDir = path.join(newslettersDir, "pdfs");
  if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
  }
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir, { recursive: true });
  }

  // Scan public/newsletters/pdfs and public/newsletters for any .pdf files
  const pdfFiles = [
    ...(fs.existsSync(pdfsDir)
      ? fs
          .readdirSync(pdfsDir)
          .filter((file) => file.endsWith(".pdf"))
          .map((file) => ({ file, dir: pdfsDir }))
      : []),
    ...fs
      .readdirSync(newslettersDir)
      .filter((file) => file.endsWith(".pdf"))
      .map((file) => ({ file, dir: newslettersDir })),
  ];

  if (pdfFiles.length === 0) {
    console.log(
      "No PDF files found in public/newsletters/pdfs/\nTo add a new newsletter:\n1. Place your PDF file in public/newsletters/pdfs/ (e.g., newsletter-6.pdf)\n2. Re-run: pnpm generate-newsletters\n3. Update src/app/newsletter/newsletter-data.ts",
    );
    return;
  }

  console.log(`Found ${pdfFiles.length} PDF file(s) to process...`);

  for (const { file, dir } of pdfFiles) {
    const id = path.basename(file, ".pdf");
    const pdfPath = path.join(dir, file);

    console.log(`\nProcessing ${file} (ID: ${id})...`);
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjs.getDocument({
      data,
      useSystemFonts: true,
      disableFontFace: true,
    });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    const itemPagesDir = path.join(pagesDir, id);
    if (!fs.existsSync(itemPagesDir)) {
      fs.mkdirSync(itemPagesDir, { recursive: true });
    }

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = createCanvas(viewport.width, viewport.height);
      const ctx = canvas.getContext("2d");

      await page.render({
        canvasContext: ctx,
        viewport: viewport,
      }).promise;

      const rawBuffer = canvas.toBuffer("image/png");
      const webpBuffer = await sharp(rawBuffer)
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      const pageImgPath = path.join(itemPagesDir, `page-${pageNum}.webp`);
      fs.writeFileSync(pageImgPath, webpBuffer);

      if (pageNum === 1) {
        const coverImgPath = path.join(coversDir, `${id}.webp`);
        fs.writeFileSync(coverImgPath, webpBuffer);
      }
      page.cleanup();
    }
    await loadingTask.destroy();

    console.log(`Successfully generated ${numPages} WebP pages for ${id}!`);
    console.log(`Copy snippet for src/app/newsletter/newsletter-data.ts:`);
    console.log(`  {
    id: "${id}",
    slug: "${id}",
    title: "MUAS Newsletter - [Month Year]",
    date: "[Month Year]",
    coverImage: "/newsletters/covers/${id}.webp",
    pdfUrl: "/newsletters/pdfs/${id}.pdf",
    pageCount: ${numPages},
    pages: buildPagePaths("${id}", ${numPages}),
  },`);
  }

  console.log(
    "\nAsset generation complete! PDFs in public/newsletters/pdfs/ are ready for user downloads.",
  );
}

generateNewsletterAssets()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error generating WebP newsletter assets:", err);
    process.exit(1);
  });
