import type { SearchDocument, SearchTarget } from "@/lib/search/types";
import {
  componentSearchContent,
  searchSlug,
  textSearchContent,
} from "@/lib/search/content";
import { keyFeatures } from "./key-features-data";
import { scrollHeroCopy, type ScrollHeroLine } from "./scroll-hero-data";
import { techSpecPanels } from "./tech-specs-data";

function lineText(line: ScrollHeroLine) {
  return typeof line === "string"
    ? line
    : line.segments.map((segment) => segment.text).join("");
}

function heroLineContent() {
  return scrollHeroCopy.flatMap((copy) =>
    copy.lines.map((line) => {
      const text = lineText(line);

      return textSearchContent({
        id: `${copy.key}-${searchSlug(text)}`,
        text,
        componentTargetId: "suas-hero",
        highlightTargetId: `suas-hero-${copy.key}-${searchSlug(text)}`,
      });
    }),
  );
}

function techSpecContent(panel: (typeof techSpecPanels)[number]) {
  const panelSlug = searchSlug(panel.navTitle);

  return [
    textSearchContent({
      id: `${panelSlug}-nav`,
      text: panel.navTitle,
      componentTargetId: "technical-specifications",
      highlightTargetId: `tech-spec-${panelSlug}-nav`,
    }),
    textSearchContent({
      id: `${panelSlug}-heading`,
      text: panel.title,
      componentTargetId: "technical-specifications",
      highlightTargetId: `tech-spec-${panelSlug}-heading`,
    }),
    ...(panel.kicker
      ? [
          textSearchContent({
            id: `${panelSlug}-kicker`,
            text: panel.kicker,
            componentTargetId: "technical-specifications",
            highlightTargetId: `tech-spec-${panelSlug}-kicker`,
          }),
        ]
      : []),
    textSearchContent({
      id: `${panelSlug}-subtitle`,
      text: panel.subtitle,
      componentTargetId: "technical-specifications",
      highlightTargetId: `tech-spec-${panelSlug}-subtitle`,
    }),
    ...panel.metrics.flatMap((metric) => {
      const metricSlug = searchSlug(metric.label);

      return [
        textSearchContent({
          id: `${panelSlug}-${metricSlug}-label`,
          text: metric.label,
          componentTargetId: "technical-specifications",
          highlightTargetId: `tech-spec-${panelSlug}-${metricSlug}-label`,
        }),
        textSearchContent({
          id: `${panelSlug}-${metricSlug}-value`,
          text: metric.value,
          componentTargetId: "technical-specifications",
          highlightTargetId: `tech-spec-${panelSlug}-${metricSlug}-value`,
        }),
      ];
    }),
  ];
}

export const suasHomeSearchDocument: SearchDocument = {
  route: "/suas-2026-home",
  title: "Redback",
  targets: [
    {
      id: "suas-hero",
      label: "Hero",
      hash: "suas-hero",
      text: heroLineContent(),
    },
    ...keyFeatures.map(
      (feature): SearchTarget => ({
        id: `key-feature-${feature.slug}`,
        label: feature.title,
        hash: "key-features",
        text: [
          {
            id: "heading",
            text: feature.title,
            componentTargetId: `key-feature-${feature.slug}`,
            highlightTargetId: `key-feature-${feature.slug}-heading`,
            highlightMode: "text",
            targetType: "text",
          },
          {
            id: "body",
            text: feature.body,
            componentTargetId: `key-feature-${feature.slug}`,
            highlightTargetId: `key-feature-${feature.slug}-body`,
            highlightMode: "text",
            targetType: "text",
          },
        ],
        interaction: {
          type: "accordion",
          groupId: "key-features",
          value: feature.slug,
        },
        reveal: {
          expand: {
            id: "key-features",
            itemId: feature.slug,
          },
        },
      }),
    ),
    {
      id: "technical-specifications",
      label: "Technical Specifications",
      hash: "technical-specifications",
      text: [
        textSearchContent({
          id: "heading",
          text: "Technical Specifications",
          componentTargetId: "technical-specifications",
          highlightTargetId: "technical-specifications-heading",
        }),
      ],
    },
    ...techSpecPanels.map(
      (panel): SearchTarget => ({
        id: `technical-specifications-${searchSlug(panel.navTitle)}`,
        label: `${panel.navTitle} Specifications`,
        hash: "technical-specifications",
        text: techSpecContent(panel),
        interaction: {
          type: "pill",
          groupId: "technical-specifications",
          value: searchSlug(panel.navTitle),
        },
      }),
    ),
    {
      id: "redback-team-link",
      label: "The Redback Team",
      hash: "redback-team-link",
      text: [
        textSearchContent({
          id: "heading",
          text: "Next: The Redback Team",
          componentTargetId: "redback-team-link",
          highlightTargetId: "redback-team-link-heading",
        }),
        textSearchContent({
          id: "description",
          text: "Learn about the people behind Redback and key design decisions made along the way towards SUAS 2026.",
          componentTargetId: "redback-team-link",
          highlightTargetId: "redback-team-link-description",
        }),
        componentSearchContent("cta", "Explore Now"),
      ],
    },
  ],
};
