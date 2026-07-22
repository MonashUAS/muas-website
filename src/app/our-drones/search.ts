import type { SearchDocument, SearchTarget } from "@/lib/search/types";
import { textSearchContent } from "@/lib/search/content";
import { drones } from "./drone-data";

function specText(
  specs: Array<{ label: string; value: string }>,
  prefix: string,
) {
  return specs.flatMap((spec) => [
    {
      id: `${prefix}-${spec.label}-label`,
      text: spec.label,
      highlightTargetId: `${prefix}-${spec.label.toLowerCase().replaceAll(" ", "-")}-label`,
      highlightMode: "text" as const,
    },
    {
      id: `${prefix}-${spec.label}-value`,
      text: spec.value,
      highlightTargetId: `${prefix}-${spec.label.toLowerCase().replaceAll(" ", "-")}-value`,
      highlightMode: "text" as const,
    },
  ]);
}

export const ourDronesSearchDocument: SearchDocument = {
  route: "/our-drones",
  title: "Our Drones",
  targets: [
    {
      id: "our-drones-page",
      label: "Our Drones",
      hash: "our-drones-page",
      text: [
        textSearchContent({
          id: "kicker",
          text: "Explore",
          componentTargetId: "our-drones-page",
          highlightTargetId: "our-drones-kicker",
        }),
        textSearchContent({
          id: "heading",
          text: "Our Drones",
          componentTargetId: "our-drones-page",
          highlightTargetId: "our-drones-heading",
        }),
      ],
      keywords: ["Explore Our Drones"],
    },
    ...drones.map(
      (drone): SearchTarget => ({
        id: `drone-${drone.slug}`,
        label: drone.name,
        hash: "our-drones-page",
        text: [
          {
            id: "heading",
            text: drone.name,
            componentTargetId: `drone-${drone.slug}`,
            highlightTargetId: `drone-${drone.slug}-heading`,
            highlightMode: "text",
            targetType: "text",
          },
          ...drone.description.map((paragraph, index) => ({
            id: `description-${index}`,
            text: paragraph,
            componentTargetId: `drone-${drone.slug}`,
            highlightTargetId: `drone-${drone.slug}-description-${index}`,
            highlightMode: "text" as const,
            targetType: "text" as const,
          })),
          ...specText(drone.features, `drone-${drone.slug}-feature`),
          ...specText(drone.dimensions, `drone-${drone.slug}-dimension`),
        ],
        reveal: {
          carousel: {
            id: "our-drones-carousel",
            slideId: drone.slug,
          },
          modal: {
            id: "drone-details",
            itemId: drone.slug,
          },
        },
      }),
    ),
  ],
};
