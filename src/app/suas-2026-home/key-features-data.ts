export type KeyFeature = {
  title: string;
  body: string;
  model: string;
};

export const keyFeatures: KeyFeature[] = [
  {
    title: "Autonomous Flight",
    body: "Redback is kitted with a dual-mode waypoint navigation system to achieve autonomous flight. Standard Waypoint Navigation flies expected routes seamlessly, while Guided Mode Control enables diversion from minimal waypoint plans, such as for patient detection, and is backed with a dynamic motion planner to perform live obstacle avoidance.",
    model: "/models/auto-flight.glb",
  },
  {
    title: "Endurance Optimisation",
    body: "Equipped with four high efficiency motors and custom propellers, Redback is optimised to fly further and faster. To ensure the aircraft has the power to fly endurance missions, 6 100Wh 6S batteries are placed in cells of 2, replicating 3 12S batteries.",
    model: "/models/endurance.glb",
  },
  {
    title: "Risk Mapping",
    body: "A series of photos is captured with the onboard camera while flying in a predetermined path. An image stitching algorithm generates a high quality total view of the search boundary.",
    model: "/models/mapping.glb",
  },
  {
    title: "Patient Detection",
    body: "An advanced object detection model processes the camera feed to identify and pinpoint the exact coordinates of a person or a tent.",
    model: "/models/detection.glb",
  },
  {
    title: "Safe Payload Deployment",
    body: "Redback's passive resistive braking system ensures a controlled, tethered payload release, allowing the bottle and beacon to be delivered to aid a person in need in no time.",
    model: "/models/lifeline.glb",
  },
];
