"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Sponsor = {
  name: string;
  src: string;
  frameClassName: string;
};

type SponsorRow = {
  desktopColumns: 1 | 2 | 3;
  sponsors: Sponsor[];
};

const sponsorRows: SponsorRow[] = [
  {
    desktopColumns: 2,
    sponsors: [
      {
        name: "Monash University",
        src: "/images/sponsors/Monash University.png",
        frameClassName: "h-48 w-full max-w-[32rem] sm:h-52 lg:h-56",
      },
      {
        name: "CubePilot",
        src: "/images/sponsors/Cube Pilot.png",
        frameClassName: "h-52 w-full max-w-[26rem] sm:h-56 lg:h-60",
      },
    ],
  },
  {
    desktopColumns: 3,
    sponsors: [
      {
        name: "Stahl Metall Engineering",
        src: "/images/sponsors/Stahl Metall.png",
        frameClassName: "h-28 w-full max-w-[20rem]",
      },
      {
        name: "SUAS-ROV",
        src: "/images/sponsors/Suas_Rov.png",
        frameClassName: "h-40 w-full max-w-[11rem]",
      },
      {
        name: "Altium",
        src: "/images/sponsors/Altium.png",
        frameClassName: "h-24 w-full max-w-[19rem]",
      },
    ],
  },
  {
    desktopColumns: 3,
    sponsors: [
      {
        name: "Leap Australia",
        src: "/images/sponsors/Leap.png",
        frameClassName: "h-36 w-full max-w-[14rem]",
      },
      {
        name: "Milliamp Diode",
        src: "/images/sponsors/Milliamp_Diode.png",
        frameClassName: "h-32 w-full max-w-[18rem]",
      },
      {
        name: "Ironbark Composites",
        src: "/images/sponsors/Ironbark_Composites.png",
        frameClassName: "h-28 w-full max-w-[21rem]",
      },
    ],
  },
  {
    desktopColumns: 3,
    sponsors: [
      {
        name: "Ansys",
        src: "/images/sponsors/Ansys.png",
        frameClassName: "h-28 w-full max-w-[19rem]",
      },
      {
        name: "Monash University PEARL",
        src: "/images/sponsors/Pearl logo - Copy.jpg",
        frameClassName: "h-32 w-full max-w-[20rem]",
      },
      {
        name: "SAGE",
        src: "/images/sponsors/Sage.png",
        frameClassName: "h-28 w-full max-w-[19rem]",
      },
    ],
  },
  {
    desktopColumns: 3,
    sponsors: [
      {
        name: "PTC",
        src: "/images/sponsors/PTC (2).png",
        frameClassName: "h-32 w-full max-w-[18rem]",
      },
      {
        name: "freedcamp",
        src: "/images/sponsors/Freedcamp.png",
        frameClassName: "h-28 w-full max-w-[19rem]",
      },
      {
        name: "SIYI",
        src: "/images/sponsors/SIYI.png",
        frameClassName: "h-32 w-full max-w-[18rem]",
      },
    ],
  },
  {
    desktopColumns: 1,
    sponsors: [
      {
        name: "Kiteaero",
        src: "/images/sponsors/Copy of KITEAEROLOGO-BLACK.png",
        frameClassName: "h-16 w-full max-w-[18rem]",
      },
    ],
  },
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
      {
        rootMargin: "0px 0px -8%",
        threshold: 0.15,
      },
    );

    for (const row of rowElements.current) {
      if (row) observer.observe(row);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {sponsorRows.map((row, rowIndex) => {
        const rowSpacingClass =
          rowIndex === 0
            ? ""
            : rowIndex === sponsorRows.length - 1
              ? "mt-1 sm:mt-3 lg:mt-4"
              : "mt-3 sm:mt-6 lg:mt-10";

        return (
          <div
            key={row.sponsors.map((sponsor) => sponsor.name).join("-")}
            ref={(element) => {
              rowElements.current[rowIndex] = element;
            }}
            data-row-index={rowIndex}
            className={`grid grid-cols-12 gap-y-2 transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none sm:gap-x-8 sm:gap-y-4 ${rowSpacingClass} ${
              visibleRows[rowIndex]
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
          >
            {row.sponsors.map((sponsor, sponsorIndex) => {
              const isTabletOrphan =
                row.desktopColumns === 3 && sponsorIndex === 2;
              const isTabletCentered =
                row.desktopColumns === 1 || isTabletOrphan;

              const desktopColumnClass =
                row.desktopColumns === 1
                  ? "lg:col-span-12"
                  : row.desktopColumns === 2
                    ? "lg:col-span-6"
                    : "lg:col-span-4";

              return (
                <div
                  key={sponsor.name}
                  className={`col-span-12 flex items-center justify-center sm:col-span-6 ${
                    row.desktopColumns === 2
                      ? "h-44 sm:h-52 lg:h-64"
                      : "h-32 sm:h-40 lg:h-48"
                  } ${desktopColumnClass} ${
                    isTabletCentered
                      ? "sm:col-start-4 lg:col-start-auto"
                      : ""
                  }`}
                >
                  <div
                    className={`relative max-h-full ${sponsor.frameClassName}`}
                  >
                    <Image
                      src={sponsor.src}
                      alt={`${sponsor.name} logo`}
                      fill
                      sizes={
                        row.desktopColumns === 1
                          ? "(min-width: 1024px) 18rem, (min-width: 640px) 18rem, calc(100vw - 116px)"
                          : row.desktopColumns === 2
                            ? "(min-width: 1024px) 32rem, (min-width: 640px) calc(50vw - 74px), calc(100vw - 116px)"
                            : "(min-width: 1024px) 21rem, (min-width: 640px) calc(50vw - 74px), calc(100vw - 116px)"
                      }
                      className="object-contain"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
