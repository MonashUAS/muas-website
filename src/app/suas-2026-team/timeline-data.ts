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
    image: `${timelineImageDir}/First Design Meeting.jpg`,
    alt: "SUAS team gathered for the first Redback design meeting",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "25 September 2025",
    title: "Initial Propulsion System Specification Completed",
    body: "The initial propulsion system specification was completed. The system was designed to provide sufficient energy capacity without excessive weight while maintaining the power density required under competition flight conditions.",
    image: `${timelineImageDir}/Initial Propulsion System Spec Completed.JPG`,
    alt: "Redback propulsion system specification hardware",
    objectPosition: "50% 45%",
  }),
  timelineItem({
    date: "16 December 2025",
    title: "First Successful Lifeline Deployment",
    body: "The team successfully released the 155 g beacon payload from the minimum required altitude of 45 metres above ground level.",
    image: `${timelineImageDir}/First Successful Lifeline Deployment.jpg`,
    alt: "Successful Redback lifeline payload deployment",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "25 January 2026",
    title: "Gimbal Camera Hardware Integration",
    body: "The gimbal camera was integrated with a third-party network link and its connection stabilised. Packet loss was diagnosed using networking expertise and guidance from former team members.",
    image: `${timelineImageDir}/Gimbal Camera Hardware Integration.jpg`,
    alt: "Gimbal camera hardware integrated on Redback",
    objectPosition: "50% 35%",
  }),
  timelineItem({
    date: "28 January 2026",
    title: "Redback Proof-of-Concept Maiden Flight",
    body: "Redback completed the successful maiden flight of its proof-of-concept aircraft, demonstrating stronger-than-expected flight performance during initial testing.",
    image: `${timelineImageDir}/Maiden Flight V1.jpg`,
    alt: "Redback proof-of-concept aircraft during maiden flight",
    objectPosition: "50% 35%",
  }),
  timelineItem({
    date: "09/02/2026",
    title: "CAD V2 Design Finished",
    body: "The airframe design was completed and released for manufacturing, giving the team a ready-to-build Redback V2 structure.",
    image: `${timelineImageDir}/CAD V2 Design Finished.jpg`,
    alt: "Completed Redback V2 CAD airframe design",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "16/02/2026",
    title: "Redback V2 Frame Manufactured",
    body: "The Redback V2 airframe was manufactured and assembled in three days, turning the completed design into flight-ready structure.",
    image: `${timelineImageDir}/V2 Frame Manufactured.jpg`,
    alt: "Manufactured Redback V2 airframe",
    objectPosition: "50% 45%",
  }),
  timelineItem({
    date: "6 March 2026",
    title: "Redback V2 Maiden Flight",
    body: "Redback V2 completed its maiden flight with all competition avionics on board, a major VTOL integration milestone for the team.",
    image: `${timelineImageDir}/Maiden Flight V2.jpg`,
    alt: "Redback V2 aircraft during maiden flight",
    objectPosition: "50% 35%",
  }),
  timelineItem({
    date: "27/04/2026",
    title: "First Mission Management Mock Run",
    body: "The team completed beta testing of the full mission management system for a real-life flight, bringing the operational workflow into one coordinated run.",
    image: `${timelineImageDir}/First Mission Management Mock Run.jpg`,
    alt: "Mission management mock run for Redback",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "12 May 2026",
    title: "Vision Model Accuracy Improved",
    body: "YOLOv8 detection accuracy was initially limited because objects appeared very small at the minimum operating altitude. Performance was improved through image preprocessing and colour-based clustering to distinguish targets from the surrounding grass.",
    image: `${timelineImageDir}/Vision Model Accuracy Improved.JPG`,
    alt: "Vision model accuracy testing for Redback",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "29 May 2026",
    title: "Obstacle-Avoidance Simulation Testing and Verification",
    body: "The obstacle-avoidance system was tested through software-in-the-loop and hardware-in-the-loop simulations to verify its consistency and benchmark motion-planning response times.",
    image: `${timelineImageDir}/Avoidance Sim Verification.JPG`,
    alt: "Obstacle-avoidance simulation verification for Redback",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "12 June 2026",
    title: "Diversion and Mission-Return Simulation Testing",
    body: "The aircraft's diversion functionality and ability to return to its autonomous mission were tested and verified through software-in-the-loop and hardware-in-the-loop simulations.",
    image: `${timelineImageDir}/Diversion Sim Verification.jpg`,
    alt: "Diversion and mission-return simulation testing",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "In Progress",
    title: "Physical Avoidance and Diversion Test",
    body: "The avoidance and diversion functions will be physically tested at flight days, moving the autonomy stack from simulation into real aircraft behavior.",
    image: `${timelineImageDir}/Physical Avoidance and Diversion Test.jpg`,
    alt: "Physical avoidance and diversion flight testing",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "In Progress",
    title: "First Braking System Drop Simulation",
    body: "The Lifeline team simulated payload release and brought the payload down to the desired drop speed, validating the braking concept before field deployment.",
    image: `${timelineImageDir}/First Braking System Drop Simulation.JPG`,
    alt: "Lifeline braking system drop simulation",
    objectPosition: "50% 45%",
  }),
  timelineItem({
    date: "Date TBC",
    title: "Propulsion Wiring Harness Repair",
    body: "The propulsion wiring harness on Redback had to be repaired under time pressure so the aircraft could be prepared for the upcoming flight day.",
    image: `${timelineImageDir}/First Successful Propulsion Test.JPG`,
    alt: "Redback propulsion system during testing and repair",
    objectPosition: "50% 45%",
  }),
  timelineItem({
    date: "Future",
    title: "Vision Detection and Payload Deployment",
    body: "A future integrated milestone will combine vision detection and payload deployment in one flight, bringing perception and mission execution together.",
    image: `${timelineImageDir}/Vision Detection and Payload Deployment.JPG`,
    alt: "Vision detection and payload deployment milestone",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "17 July 2026",
    title: "First Successful Dual-Payload Delivery",
    body: "The team successfully validated the release of both competition payloads during a single mission flight.",
    image: `${timelineImageDir}/First Lifeline Deployment.jpg`,
    alt: "Dual-payload delivery validation for Redback",
    objectPosition: "50% 40%",
  }),
  timelineItem({
    date: "24 July 2026",
    title: "First Full Mock Competition Run",
    body: "A future full mock run will rehearse the competition mission end to end, giving every subteam a shared test of readiness under realistic operating conditions.",
    image: `${timelineImageDir}/First Full Mock Competition Run.jpg`,
    alt: "Full mock competition run for Redback",
    objectPosition: "50% 40%",
  }),
];
