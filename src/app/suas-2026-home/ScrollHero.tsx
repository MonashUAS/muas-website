"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 420;
const FRAME_PATH = "/images/redback-animation/hero%20frames/";

export function ScrollHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [frame, setFrame] = useState(1);
  const [textOpacity, setTextOpacity] = useState(0);
  const [textOffset, setTextOffset] = useState(24);

  useEffect(() => {
    let animationFrame = 0;

    const update = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / scrollable);
      const nextFrame = Math.round(progress * (FRAME_COUNT - 1)) + 1;
      const fadeIn = fadeRange(progress, 0.02, 0.11);
      const fadeOut = 1 - fadeRange(progress, 0.26, 0.42);
      const opacity = clamp(Math.min(fadeIn, fadeOut));

      setFrame(nextFrame);
      setTextOpacity(opacity);
      setTextOffset(24 - opacity * 24);
    };

    const onScroll = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const warmFrames = [1, 2, 3, 4, 5, 6, 24, 48, 96, 144, 192, 240, 288, 336, 384, 420];

    warmFrames.forEach((warmFrame) => {
      const image = new Image();
      image.src = getFramePath(warmFrame);
    });
  }, []);

  function getFramePath(frame: number) {
  return `${FRAME_PATH}${String(frame).padStart(4, "0")}.png`;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function fadeRange(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start));
}


  return (
    <section ref={sectionRef} className="relative h-[460vh] bg-black-500">
      <div className="sticky top-0 h-screen overflow-hidden bg-black-500">
        {/* eslint-disable-next-line @next/next/no-img-element -- The scroll sequence swaps 420 local frames by computed URL. */}
        <img
          alt="Redback aircraft animation"
          className="h-full w-full object-cover"
          draggable={false}
          src={getFramePath(frame)}
        />

        <div
          aria-hidden={textOpacity < 0.05}
          className="pointer-events-none absolute inset-0 flex items-center px-6 sm:px-10 lg:px-16"
          style={{
            opacity: textOpacity,
            transform: `translateY(${textOffset}px)`,
            transition: "opacity 140ms linear, transform 140ms linear",
          }}
        >
          <h1 className="max-w-5xl text-[clamp(2.6rem,7vw,6rem)] font-medium leading-[1.05] text-white">
            Search and rescue operations redefined. Built for the storm.
            <br />
            Powered by innovation.
            <br />
            Inspired by nature.
          </h1>
        </div>
      </div>
    </section>
  );
}
