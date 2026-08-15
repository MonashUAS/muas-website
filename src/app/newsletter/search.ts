import type { SearchDocument, SearchTarget } from "@/lib/search/types";
import { textSearchContent } from "@/lib/search/content";
import { newsletters } from "./newsletter-data";

/**
 * Generates search document configuration for all newsletters.
 * Enables site-wide search indexing and deep linking to newsletter items.
 */
export const newsletterSearchDocument: SearchDocument = {
  route: "/newsletter",
  title: "Newsletters",
  targets: [
    {
      id: "newsletter-page",
      label: "Newsletters",
      hash: "newsletter-page",
      text: [
        textSearchContent({
          id: "heading",
          text: "Explore Our Newsletters",
          componentTargetId: "newsletter-page",
          highlightTargetId: "newsletter-heading",
        }),
      ],
      keywords: ["Explore Our Newsletters", "Newsletters", "MUAS Publications"],
    },
    ...newsletters.map(
      (newsletter): SearchTarget => ({
        id: `newsletter-${newsletter.slug}`,
        label: newsletter.date,
        hash: "newsletter-page",
        text: [
          {
            id: "heading",
            text: newsletter.title,
            componentTargetId: `newsletter-${newsletter.slug}`,
            highlightTargetId: `newsletter-${newsletter.slug}-heading`,
            highlightMode: "text",
            targetType: "text",
          },
        ],
        reveal: {
          carousel: {
            id: "newsletter-carousel",
            slideId: newsletter.slug,
          },
          modal: {
            id: "newsletter-reader",
            itemId: newsletter.slug,
          },
        },
      }),
    ),
  ],
};
