export type Newsletter = {
  id: string;
  slug: string;
  title: string;
  date: string;
  issueNumber: number;
  coverImage: string;
  pdfUrl: string;
  pageCount: number;
  pages: string[];
};

/**
 * Builds array of page image paths for a given newsletter ID and page count.
 * Uses high-performance WebP image format for optimized web loading.
 * @param id - The unique newsletter identifier.
 * @param pageCount - Total number of pages in the newsletter.
 * @returns Array of public WebP URL strings for each page image.
 */
function buildPagePaths(id: string, pageCount: number): string[] {
  return Array.from(
    { length: pageCount },
    (_, i) => `/newsletters/pages/${id}/page-${i + 1}.webp`,
  );
}

/**
 * List of published MUAS newsletters ordered from newest to oldest.
 * Easily extendable by appending new newsletter objects to this array.
 */
export const newsletters: Newsletter[] = [
  {
    id: "newsletter-5",
    slug: "october-2025",
    title: "MUAS Newsletter - Issue 5",
    date: "October 2025",
    issueNumber: 5,
    coverImage: "/newsletters/covers/newsletter-5.webp",
    pdfUrl: "/newsletters/pdfs/newsletter-5.pdf",
    pageCount: 11,
    pages: buildPagePaths("newsletter-5", 11),
  },
  {
    id: "newsletter-4",
    slug: "july-2025",
    title: "MUAS Newsletter - Issue 4",
    date: "July 2025",
    issueNumber: 4,
    coverImage: "/newsletters/covers/newsletter-4.webp",
    pdfUrl: "/newsletters/pdfs/newsletter-4.pdf",
    pageCount: 16,
    pages: buildPagePaths("newsletter-4", 16),
  },
  {
    id: "newsletter-3",
    slug: "september-2024",
    title: "MUAS Newsletter - Issue 3",
    date: "September 2024",
    issueNumber: 3,
    coverImage: "/newsletters/covers/newsletter-3.webp",
    pdfUrl: "/newsletters/pdfs/newsletter-3.pdf",
    pageCount: 16,
    pages: buildPagePaths("newsletter-3", 16),
  },
  {
    id: "newsletter-2",
    slug: "march-2024",
    title: "MUAS Newsletter - Issue 2",
    date: "March 2024",
    issueNumber: 2,
    coverImage: "/newsletters/covers/newsletter-2.webp",
    pdfUrl: "/newsletters/pdfs/newsletter-2.pdf",
    pageCount: 26,
    pages: buildPagePaths("newsletter-2", 26),
  },
  {
    id: "newsletter-1",
    slug: "october-2023",
    title: "MUAS Newsletter - Issue 1",
    date: "October 2023",
    issueNumber: 1,
    coverImage: "/newsletters/covers/newsletter-1.webp",
    pdfUrl: "/newsletters/pdfs/newsletter-1.pdf",
    pageCount: 17,
    pages: buildPagePaths("newsletter-1", 17),
  },
];
