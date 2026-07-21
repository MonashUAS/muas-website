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
  lines: ScrollHeroLine[];
  window: TextWindow;
  position: string;
};

export type ScrollHeroLine =
  | string
  | {
      segments: ScrollHeroTextSegment[];
    };

export type ScrollHeroTextSegment = {
  className?: string;
  text: string;
};

const blueGradientText =
  "bg-gradient-to-r from-blue-200 to-blue-700 bg-clip-text text-transparent";

export const scrollHeroCopy: ScrollHeroCopy[] = [
  {
    key: "suas",
    className: "text-h5",
    lines: ["SUAS 2026"],
    window: TEXT_WINDOWS.suas,
    position: "justify-center text-center translate-y-[-25%]",
  },
  {
    key: "presents",
    className: "text-h5",
    lines: [
      {
        segments: [
          { className: "bg-gradient-to-b from-blue-700 to-blue-200 bg-clip-text text-transparent", text: "MUAS" },
          { text: " Presents..." },
        ],
      },
    ],
    window: TEXT_WINDOWS.presents,
    position: "justify-center text-center translate-y-[-25%]",
  },
  {
    key: "redback",
    className: "bg-gradient-to-r from-red-700 to-red-200 bg-clip-text text-h3 text-transparent sm:text-h1",
    lines: ["Redback"],
    window: TEXT_WINDOWS.redback,
    position: "justify-center text-center",
  },
  {
    key: "rescue",
    className: "max-w-2xl text-h7 sm:text-h5",
    lines: [
      {
        segments: [
          { text: "Built for " },
          { className: blueGradientText, text: "search and rescue" },
        ],
      },
      {
        segments: [
          { text: "Powered by " },
          { className: blueGradientText, text: "innovation" },
        ],
      },
      {
        segments: [
          { text: "Inspired by " },
          { className: blueGradientText, text: "nature" },
        ],
      },
    ],
    window: TEXT_WINDOWS.rescue,
    // 1. pb-[15vh] scales dynamically based on phone height.
    // 2. Flex justification + safe padding completely prevents tablet horizontal cut-offs.
    position: "justify-end text-right pb-[50vh] md:pb-[5vh] lg:pb-0 lg:pr-[8vw]",
  },
  {
    key: "closing",
    className: "max-w-xl text-h5",
    layer: "behind-frame",
    lines: [
      {
        segments: [
          { className: "bg-gradient-to-r from-blue-700 to-blue-200 bg-clip-text text-transparent", text: "Rapid deployment" },
          { text: " of relief where it is needed most." },
        ],
      }],
    window: TEXT_WINDOWS.closing,
    position: "justify-center text-center",
  },
];