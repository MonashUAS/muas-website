const TEXT_WINDOWS = {
  suas: { fadeInStart: 0.005, fadeInEnd: 0.01, fadeOutStart: 0.03, fadeOutEnd: 0.07 },
  presents: { fadeInStart: 0.08, fadeInEnd: 0.085, fadeOutStart: 0.105, fadeOutEnd: 0.13 },
  redback: { fadeInStart: 0.15, fadeInEnd: 0.2, fadeOutStart: 0.175, fadeOutEnd: 0.35 },
  rescue: { fadeInStart: 0.43, fadeInEnd: 0.5, fadeOutStart: 0.63, fadeOutEnd: 0.76 },
  closing: { fadeInStart: 0.84, fadeInEnd: 0.94 },
};

export type TextWindow =
  | {
      fadeInStart: number;
      fadeInEnd: number;
      fadeOutStart: number;
      fadeOutEnd: number;
    }
  | {
      fadeInStart: number;
      fadeInEnd: number;
      fadeOutStart?: never;
      fadeOutEnd?: never;
    };

export type ScrollHeroCopy = {
  key: string;
  className: string;
  layer?: "behind-frame";
  lines: string[];
  window: TextWindow;
  position: string;
};

export const scrollHeroCopy: ScrollHeroCopy[] = [
  {
    key: "suas",
    className: "text-h5",
    lines: ["SUAS 2026"],
    window: TEXT_WINDOWS.suas,
    position: "justify-start text-left",
  },
  {
    key: "presents",
    className: "text-h5",
    lines: ["MUAS Presents..."],
    window: TEXT_WINDOWS.presents,
    position: "justify-start text-left",
  },
  {
    key: "redback",
    className: "text-h3 sm:text-h1",
    lines: ["Redback"],
    window: TEXT_WINDOWS.redback,
    position: "justify-center text-center",
  },
  {
    key: "rescue",
    className: "max-w-2xl text-h5",
    lines: [
      "Built for search and rescue",
      "Powered by innovation",
      "Inspired by nature",
    ],
    window: TEXT_WINDOWS.rescue,
    position: "justify-end text-right",
  },
  {
    key: "closing",
    className: "max-w-xl text-h5",
    layer: "behind-frame",
    lines: ["Rapid deployment of relief where it is  needed most."],
    window: TEXT_WINDOWS.closing,
    position: "justify-center text-center",
  },
];
