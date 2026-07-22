export type KeyFeature = {
  title: string;
  body: string;
  media: {
    src: string;
    type: "model" | "video";
  };
};

export const keyFeatures: KeyFeature[] = [
  {
    title: "Autonomous Flight",
    body: "Powered by dual-mode waypoint navigation and a dynamic motion planner, Redback executes seamless automated routes while performing live obstacle avoidance and emergency real-time diversions.",
    media: {
      src: "/models/auto-flight.mp4",
      type: "video",
    },
  },
  {
    title: "Endurance Optimisation",
    body: "Engineered with high-efficiency motors, custom propellers, and a robust 6-battery 12S-equivalent setup, Redback is built to fly faster, cover greater distances, and conquer extended missions.",
    media: {
      src: "/models/endurance.mp4",
      type: "video",
    },
  },
  {
    title: "Risk Mapping",
    body: "Capturing targeted aerial sequences along preset flight paths, Redback's onboard stitching algorithms rapidly transform raw snapshots into a high-resolution overview of the entire search boundary.",
    media: {
      src: "/models/mapping.mp4",
      type: "video",
    },
  },
  {
    title: "Patient Detection",
    body: "A real-time computer vision model actively processes live camera feeds to spot individuals or tents, instantly locking onto and pinpointing their exact GPS coordinates.",
    media: {
      src: "/models/detection.mp4",
      type: "video",
    },
  },
  {
    title: "Safe Payload Deployment",
    body: "Utilising a passive resistive braking system, Redback executes controlled, tethered drops to rapidly deliver a water bottle and beacon directly to those in need.",
    media: {
      src: "/models/lifeline.mp4",
      type: "video",
    },
  },
];