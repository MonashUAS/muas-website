export type SearchHighlightMode = "text" | "component";

export type SearchMatchRange = {
  start: number;
  end: number;
};

export type SearchTextContent = {
  id: string;
  text: string;
  keywords?: string[];
  componentTargetId?: string;
  highlightTargetId?: string;
  highlightMode?: SearchHighlightMode;
  targetType?: SearchHighlightMode;
};

export type SearchContent = string | SearchTextContent;

export type SearchInteractionType =
  | "carousel"
  | "pill"
  | "tab"
  | "segmented"
  | "accordion"
  | "modal";

export type SearchInteraction = {
  type: SearchInteractionType;
  groupId: string;
  value: string;
};

export type SearchRevealState = {
  carousel?: {
    id: string;
    slideId: string;
  };
  expand?: {
    id: string;
    itemId: string;
  };
  modal?: {
    id: string;
    itemId: string;
  };
};

export type SearchTarget = {
  id: string;
  label: string;
  text: SearchContent[];
  keywords?: string[];
  hash?: string;
  interaction?: SearchInteraction | SearchInteraction[];
  reveal?: SearchRevealState;
};

export type SearchDocument = {
  route: string;
  title: string;
  targets: SearchTarget[];
};

export type SearchDestination = {
  route: string;
  pageTitle: string;
  target: SearchTarget;
  content?: SearchTextContent;
  scrollTargetId?: string;
  textTargetId?: string;
  componentTargetId?: string;
  targetType?: SearchHighlightMode;
  matchRange?: SearchMatchRange;
  matchQuery?: string;
};
