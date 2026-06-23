"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Sponsor = {
  name: string;
  src: string;
  width: number;
  height: number;
  imageClassName?: string;
};

const sponsorRows: Sponsor[][] = [
  [
    {
      name: "Monash University",
      src: "/images/sponsors/Monash University.png",
      width: 598,
      height: 266,
      imageClassName: "max-h-44 max-w-[28rem] lg:max-h-52",
    },
    {
      name: "CubePilot",
      src: "/images/sponsors/Cube Pilot.png",
      width: 512,
      height: 338,
      imageClassName: "max-h-44 max-w-[24rem] lg:max-h-52",
    },
  ],
  [
    {
      name: "Stahl Metall Engineering",
      src: "/images/sponsors/Stahl Metall.png",
      width: 4503,
      height: 1284,
      imageClassName: "max-h-32 max-w-[20rem]",
    },
    {
      name: "SUAS-ROV",
      src: "/images/sponsors/Suas_Rov.png",
      width: 180,
      height: 48,
      imageClassName: "max-h-28 max-w-[15rem]",
    },
    {
      name: "Altium",
      src: "/images/sponsors/Altium.png",
      width: 512,
      height: 116,
      imageClassName: "max-h-28 max-w-[19rem]",
    },
  ],
  [
    {
      name: "Leap Australia",
      src: "/images/sponsors/Leap.png",
      width: 280,
      height: 280,
      imageClassName: "max-h-40 max-w-[15rem]",
    },
    {
      name: "Milliamp Diode",
      src: "/images/sponsors/Milliamp_Diode.png",
      width: 432,
      height: 266,
      imageClassName: "max-h-36 max-w-[18rem]",
    },
    {
      name: "Ironbark Composites",
      src: "/images/sponsors/Ironbark_Composites.png",
      width: 400,
      height: 92,
      imageClassName: "max-h-28 max-w-[19rem]",
    },
  ],
  [
    {
      name: "Ansys",
      src: "/images/sponsors/Ansys.png",
      width: 2560,
      height: 808,
      imageClassName: "max-h-32 max-w-[19rem]",
    },
    {
      name: "Monash University PEARL",
      src: "/images/sponsors/Pearl logo - Copy.jpg",
      width: 2500,
      height: 1407,
      imageClassName: "max-h-36 max-w-[20rem]",
    },
    {
      name: "SAGE",
      src: "/images/sponsors/Sage.png",
      width: 712,
      height: 266,
      imageClassName: "max-h-32 max-w-[19rem]",
    },
  ],
  [
    {
      name: "PTC",
      src: "/images/sponsors/PTC (2).png",
      width: 2560,
      height: 1045,
      imageClassName: "max-h-36 max-w-[18rem]",
    },
    {
      name: "freedcamp",
      src: "/images/sponsors/Freedcamp.png",
      width: 632,
      height: 266,
      imageClassName: "max-h-32 max-w-[19rem]",
    },
    {
      name: "SIYI",
      src: "/images/sponsors/SIYI.png",
      width: 680,
      height: 266,
      imageClassName: "max-h-36 max-w-[18rem]",
    },
  ],
];

export function SponsorGrid() {
  const rowElements = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleRows, setVisibleRows] = useState<boolean[]>(() =>
    sponsorRows.map(() => false),
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const rowIndex = Number(
            (entry.target as HTMLElement).dataset.rowIndex,
          );
          setVisibleRows((current) => {
            if (current[rowIndex]) return current;

            const next = [...current];
            next[rowIndex] = true;
            return next;
          });
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8%", threshold: 0.15 },
    );

    for (const row of rowElements.current) {
      if (row) observer.observe(row);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-10 sm:space-y-14 lg:space-y-16">
      {sponsorRows.map((row, rowIndex) => {
        const isFeatureRow = row.length === 2;

        return (
          <div
            key={row.map((sponsor) => sponsor.name).join("-")}
            ref={(element) => {
              rowElements.current[rowIndex] = element;
            }}
            data-row-index={rowIndex}
            className={`grid grid-cols-12 gap-x-8 gap-y-6 transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              visibleRows[rowIndex]
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
          >
            {row.map((sponsor, sponsorIndex) => (
              <div
                key={sponsor.name}
                className={`col-span-12 flex items-center justify-center sm:col-span-6 ${
                  isFeatureRow ? "lg:col-span-6" : "lg:col-span-4"
                } ${
                  !isFeatureRow && sponsorIndex === 2
                    ? "sm:col-start-4 lg:col-start-auto"
                    : ""
                } ${isFeatureRow ? "h-56 lg:h-64" : "h-48 lg:h-56"}`}
              >
                <Image
                  src={sponsor.src}
                  alt={`${sponsor.name} logo`}
                  width={sponsor.width}
                  height={sponsor.height}
                  sizes={
                    isFeatureRow
                      ? "(min-width: 1024px) 40vw, (min-width: 640px) 45vw, 85vw"
                      : "(min-width: 1024px) 27vw, (min-width: 640px) 45vw, 85vw"
                  }
                  className={`h-full w-full object-contain ${sponsor.imageClassName ?? ""}`}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
