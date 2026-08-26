import { contactSearchDocument } from "@/app/contact-us/search";
import { homeSearchDocument } from "@/app/home/search";
import { newsletterSearchDocument } from "@/app/newsletter/search";
import { ourDronesSearchDocument } from "@/app/our-drones/search";
import { ourSponsorsSearchDocument } from "@/app/our-sponsors/search";
import { ourTeamSearchDocument } from "@/app/our-team/search";
import { recruitmentSearchDocument } from "@/app/recruitment/search";
import { sectionSearchDocuments } from "@/app/sections/search";
import { suasHomeSearchDocument } from "@/app/suas-2026-home/search";
import { suasTeamSearchDocument } from "@/app/suas-2026-team/search";
import { validateSearchDocuments } from "./validation";
import type { SearchDocument } from "./types";

export { componentSearchContent, searchSlug, textSearchContent } from "./content";

export const searchDocuments: SearchDocument[] = [
  homeSearchDocument,
  ourTeamSearchDocument,
  ourDronesSearchDocument,
  newsletterSearchDocument,
  ...sectionSearchDocuments,
  suasHomeSearchDocument,
  suasTeamSearchDocument,
  ourSponsorsSearchDocument,
  recruitmentSearchDocument,
  contactSearchDocument,
];

if (process.env.NODE_ENV !== "production") {
  validateSearchDocuments(searchDocuments);
}

export type {
  SearchContent,
  SearchDestination,
  SearchDocument,
  SearchHighlightMode,
  SearchInteraction,
  SearchMatchRange,
  SearchRevealState,
  SearchTarget,
  SearchTextContent,
} from "./types";
