import { searchSlug } from "@/lib/search/content";

export type TimelineItemContent = {
  date: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  objectPosition?: string;
  slug: string;
};

const timelineImageDir = "/images/suas-team-page/production-timeline";

function timelineItem(
  item: Omit<TimelineItemContent, "slug">,
): TimelineItemContent {
  return {
    ...item,
    slug: searchSlug(item.title),
  };
}

export const timelineItems: TimelineItemContent[] = [
  timelineItem({
    date: "4 July 2025",
    title: "First Design Meeting",
    body: "The SUAS Committee was inaugurated and began shaping the team's goals and approach for Redback against the 2025 ruleset.",
    image: `${timelineImageDir}/First Design Meeting.webp`,
    alt: "SUAS team gathered for the first Redback design meeting",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "25 September 2025",
    title: "Initial Propulsion System Specification Completed",
    body: "The initial propulsion system specification was completed. The system was designed to provide sufficient energy capacity without excessive weight while maintaining the power density required under competition flight conditions.",
    image: `${timelineImageDir}/Initial Propulsion System Spec Completed.webp`,
    alt: "Redback propulsion system specification hardware",
    objectPosition: "50% 45%",
  }),
  timelineItem({
    date: "16 December 2025",
    title: "First Successful Lifeline Deployment",
    body: "The team successfully released the 155 g beacon payload from the minimum required altitude of 45 metres above ground level.",
    image: `${timelineImageDir}/First Successful Lifeline Deployment.webp`,
    alt: "Successful Redback lifeline payload deployment",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "25 January 2026",
    title: "Gimbal Camera Hardware Integration",
    body: "The gimbal camera was integrated with a third-party network link and its connection stabilised. Packet loss was diagnosed using networking expertise and guidance from former team members.",
    image: `${timelineImageDir}/Gimbal Camera Hardware Integration.webp`,
    alt: "Gimbal camera hardware integrated on Redback",
    objectPosition: "50% 35%",
  }),
  timelineItem({
    date: "28 January 2026",
    title: "Redback Proof-of-Concept Maiden Flight",
    body: "Redback completed the successful maiden flight of its proof-of-concept aircraft, demonstrating stronger than expected flight performance during initial testing.",
    image: `${timelineImageDir}/Maiden Flight V1.webp`,
    alt: "Redback proof-of-concept aircraft during maiden flight",
    objectPosition: "50% 35%",
  }),
  timelineItem({
    date: "9 February 2026",
    title: "CAD V2 Design Finished",
    body: "The airframe design was completed and released for manufacturing, giving the team a ready-to-build Redback V2 structure.",
    image: `${timelineImageDir}/CAD V2 Design Finished.webp`,
    alt: "Completed Redback V2 CAD airframe design",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "16 February 2026",
    title: "Redback V2 Frame Manufactured",
    body: "The Redback V2 airframe was manufactured and assembled in three days, turning the completed design into flight-ready structure.",
    image: `${timelineImageDir}/V2 Frame Manufactured.webp`,
    alt: "Manufactured Redback V2 airframe",
    objectPosition: "50% 45%",
  }),
  timelineItem({
    date: "6 March 2026",
    title: "Redback V2 Maiden Flight",
    body: "Redback V2 completed its maiden flight with all competition avionics on board, a major VTOL integration milestone for the team.",
    image: `${timelineImageDir}/Maiden Flight V2.webp`,
    alt: "Redback V2 aircraft during maiden flight",
    objectPosition: "50% 35%",
  }),
  timelineItem({
    date: "12 March 2026",
    title: "Power System Harness Repair",
    body: "The Stack team repaired the power system harness on Redback under time pressure, enabling the aircraft to be prepared for the upcoming flight day.",
    image: `${timelineImageDir}/stack.webp`,
    alt: "Redback propulsion system during testing and repair",
    objectPosition: "50% 45%",
  }),
  timelineItem({
    date: "27 April 2026",
    title: "First Mission Management Mock Run and First Map Generated",
    body: "The team completed beta testing of the full mission management system for a real-life flight. Vision team successfully generated the first search boundary map.",
    image: `${timelineImageDir}/First Mission Management Mock Run.webp`,
    alt: "Mission management mock run for Redback",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "12 May 2026",
    title: "Vision Model Accuracy Improved",
    body: "YOLOv8 detection accuracy was initially limited because objects appeared very small at the minimum operating altitude. Performance was improved through image preprocessing and colour-based clustering to distinguish targets from the surrounding grass.",
    image: `${timelineImageDir}/Vision Model Accuracy Improved.webp`,
    alt: "Vision model accuracy testing for Redback",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "10 July 2026",
    title: "Obstacle-Avoidance Testing and Verification",
    body: "The DNA team validated Redback's obstacle-avoidance system at flight day, verifying its functionality and consistency.",
    image: `${timelineImageDir}/Avoidance Sim Verification.webp`,
    alt: "Obstacle-avoidance simulation verification for Redback",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "17 July 2026",
    title: "Dual-Payload Delivery, Rapid Assembly, and Full-Point Map",
    body: "The team successfully validated the release of both competition payloads during a single mission flight, while Vision generated a full-point scoring map. The team also completed the rapid assembly task, packing down the aircraft to fit check-in luggage size and bringing it to a flight-ready state with motors spinning in under 3 minutes with no more than 4 people.",
    image: `${timelineImageDir}/assembly.webp`,
    alt: "Dual-payload delivery validation for Redback",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "24 July 2026",
    title: "First Integrated Autonomous Detection and Drop",
    body: "Redback accurately detected the mannequin and executed an on-target drop, completing its first integrated autonomous detection and drop.",
    image: `${timelineImageDir}/detection-drop.webp`,
    alt: "Redback successfully completing its first integrated autonomous detection and drop during a mock competition run",
    objectPosition: "50% 40%",
  }),
];
