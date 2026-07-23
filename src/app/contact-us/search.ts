import type { SearchDocument, SearchTarget } from "@/lib/search/types";
import { socialCards } from "./contact-data";

export const contactSearchDocument: SearchDocument = {
  route: "/contact-us",
  title: "Contact Us",
  targets: [
    {
      id: "contact-page",
      label: "Contact Form",
      hash: "contact-page",
      text: [
        {
          id: "heading",
          text: "Get in Touch",
          componentTargetId: "contact-page",
          highlightTargetId: "contact-heading",
          highlightMode: "text",
          targetType: "text",
        },
        ...["name", "email", "subject", "message"].map((field) => ({
          id: `field-${field}`,
          text: field[0].toUpperCase() + field.slice(1),
          componentTargetId: "contact-page",
          highlightTargetId: `contact-field-${field}`,
          highlightMode: "text" as const,
          targetType: "text" as const,
        })),
        {
          id: "submit",
          text: "Send Message",
          componentTargetId: "contact-page",
          highlightTargetId: "contact-submit",
          highlightMode: "text",
          targetType: "text",
        },
        "Message sent successfully. We'll get back to you soon.",
      ],
    },
    {
      id: "find-us-online",
      label: "Find Us Online",
      hash: "find-us-online",
      text: [
        {
          id: "heading",
          text: "Find Us Online",
          componentTargetId: "find-us-online",
          highlightTargetId: "find-us-online-heading",
          highlightMode: "text",
          targetType: "text",
        },
      ],
    },
    ...socialCards.map(
      (card): SearchTarget => ({
        id: `contact-${card.label.toLowerCase()}`,
        label: card.label,
        hash: "find-us-online",
        text: [
          {
            id: "label",
            text: card.label,
            componentTargetId: `contact-${card.label.toLowerCase()}`,
            highlightTargetId: `contact-${card.label.toLowerCase()}-label`,
            highlightMode: "text",
            targetType: "text",
          },
          {
            id: "action",
            text: card.action,
            componentTargetId: `contact-${card.label.toLowerCase()}`,
            highlightTargetId: `contact-${card.label.toLowerCase()}-action`,
            highlightMode: "text",
            targetType: "text",
          },
          card.href,
        ],
      }),
    ),
  ],
};
