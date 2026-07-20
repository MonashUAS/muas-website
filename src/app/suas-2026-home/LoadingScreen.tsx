"use client";

import Image from "next/image";

interface LoadingScreenProps {
  /** Loading progress from 0–100. */
  progress: number;
}

/** Displays the animated loading screen. */
export default function LoadingScreen({
  progress,
}: LoadingScreenProps) {
  /** Keep progress within a valid range. */
  const clamped = Math.max(0, Math.min(progress, 100));

  /** Total height of the loading thread. */
  const webHeight = 320;

  /** Size of the spider image. */
  const spiderSize = 200;

  /** Vertical point where the thread connects to the spider. */
  const attachOffset = 50;

  /** Spider position based on loading progress. */
  const spiderY =
    (clamped / 100) * (webHeight - attachOffset);

  /** Thread connection point derived from the spider position. */
  const attachmentY = spiderY + attachOffset;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center">
        {/* Spider and thread */}
        <div
          className="relative"
          style={{
            width: spiderSize,
            height: webHeight,
          }}
        >
          {/* Completed thread */}
          <div
            className="absolute left-1/2 w-[2px] -translate-x-1/2 bg-white"
            style={{
              top: 0,
              height: attachmentY,
            }}
          />

          {/* Remaining thread */}
          <div
            className="absolute left-1/2 w-[2px] -translate-x-1/2 bg-neutral-600"
            style={{
              top: attachmentY,
              bottom: 0,
            }}
          />

          {/* Animated spider */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: spiderY,
              transform: "translateX(-50%)",
            }}
          >
            <Image
              src="/logos/redback-loading.png"
              alt=""
              width={spiderSize}
              height={spiderSize}
              priority
              draggable={false}
              className="pointer-events-none select-none"
              style={{
                filter: `
                  /* Inner glow */
                  drop-shadow(0 0 8px rgba(59,130,246,0.50))

                  /* Main glow */
                  drop-shadow(0 0 18px rgba(59,130,246,0.20))

                  /* Outer glow */
                  drop-shadow(0 0 60px rgba(59,130,246,0.15))
                `,
              }}
            />
          </div>
        </div>

        {/* Loading text */}
        <p className="mt-8 text-b1 uppercase tracking-[0.22em] text-white/70 pt-10">
          Loading Redback...
        </p>

        {/* Loading percentage */}
        <p className="mt-2 text-h7 text-white">
          {Math.round(clamped)}%
        </p>
      </div>
    </div>
  );
}