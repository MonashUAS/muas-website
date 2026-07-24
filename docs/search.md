# Search Integration

Search content is defined beside the route or data that renders it. Add or
update a route-local `search.ts` file and export a `SearchDocument` with stable
target ids, labels, searchable text, and optional interaction state.

Stable ids must come from explicit slugs or ids in source data. Do not use DOM
position, array indexes, or visible text as the only identifier.

## Standard Section

```ts
export const exampleSearchDocument = {
  route: "/example",
  title: "Example",
  targets: [
    {
      id: "example-overview",
      label: "Overview",
      hash: "example-overview",
      text: [
        {
          id: "heading",
          text: "Overview",
          componentTargetId: "example-overview",
          highlightTargetId: "example-overview-heading",
          highlightMode: "text",
          targetType: "text",
        },
        overviewCopy,
      ],
    },
  ],
};
```

The page should render an element with `id="example-overview"` and expose exact
plain-string text with `SearchableText` when phrase-level highlighting is safe.

```tsx
<SearchableText
  as="h2"
  searchId="example-overview-heading"
>
  Overview
</SearchableText>
```

## Card

```tsx
<a data-search-target-id={`contact-${card.id}`} href={card.href}>
  {card.label}
</a>
```

```ts
{
  id: `contact-${card.id}`,
  label: card.label,
  hash: "find-us-online",
  text: [card.label, card.action],
}
```

Cards usually keep component-level highlighting so the full interactive target
is visible.

## Carousel Slide

Give the carousel a search controller id and each slide a stable search target
id. The controller sets the active slide when search navigation requests it.

```ts
{
  id: `project-${project.slug}`,
  label: project.name,
  hash: "projects",
  text: [project.name, project.description],
  reveal: {
    carousel: { id: "projects-carousel", slideId: project.slug },
  },
  text: [
    {
      id: "heading",
      text: project.name,
      componentTargetId: `project-${project.slug}`,
      highlightTargetId: `project-${project.slug}-heading`,
      highlightMode: "text",
      targetType: "text",
    },
  ],
}
```

Inactive slides should mark their DOM targets with `data-search-managed="true"`.
The carousel should register only the active slide and active slide text targets.

## Fallback Order

Text navigation separates scroll positioning from exact highlighting:

1. Scroll to the section or component target.
2. Resolve the registered semantic text target.
3. Highlight only the matched character range.

Do not use a heading or section container as the highlight target for paragraph
matches. Component-level highlighting is reserved for results whose
`targetType` is intentionally `"component"`.

`SearchableText` can render the range itself for plain string children. Standard
semantic text targets use a non-mutating browser range highlight when available.

## Revealable Content

Register a reveal controller for expandable, tabbed, modal, or filtered content.
The controller should use the same state path as user interaction and then
register the visible target element.

```ts
{
  id: "team-section-auxiliary",
  label: "Auxiliary",
  text: [
    {
      id: "description",
      text: auxiliaryDescription,
      highlightTargetId: "team-section-auxiliary-description",
      highlightMode: "text",
    },
  ],
  interaction: {
    type: "pill",
    groupId: "management-team",
    value: "auxiliary",
  },
}
```

```tsx
useSearchRevealController("feature-panels", {
  reveal: (state) => {
    const interaction = state.interactions?.find(
      (item) => item.groupId === "feature-panels",
    );

    if (interaction) {
      setExpandedFeature(interaction.value);
    }
  },
});
```
