"use client";

import { useCallback, useEffect, useRef } from "react";
import { getVideoPosterSrc } from "@/lib/media-paths";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const redbackVideoSrc = "/videos/redback-video.mp4";

export function Video() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isSectionVisibleRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const pauseVideo = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const playVideo = useCallback(() => {
    const video = videoRef.current;

    if (!video || prefersReducedMotion || document.hidden) {
      return;
    }

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => undefined);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.28;

        isSectionVisibleRef.current = isVisible;

        if (isVisible) {
          playVideo();
        } else {
          pauseVideo();
        }
      },
      {
        threshold: [0, 0.28, 0.5],
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      pauseVideo();
    };
  }, [pauseVideo, playVideo]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseVideo();
        return;
      }

      if (isSectionVisibleRef.current) {
        playVideo();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pauseVideo, playVideo]);

  useEffect(() => {
    if (prefersReducedMotion) {
      pauseVideo();
    }
  }, [pauseVideo, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative grid place-items-center overflow-hidden bg-black px-4 py-6 text-white sm:min-h-[62svh] sm:px-6 sm:py-10 lg:min-h-[72svh] lg:px-8 lg:py-14"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_140%_50%_at_50%_50%,rgba(155,26,26,0.3)_0%,#000000_75%)]" />

      <div className="relative z-10 flex aspect-video w-full max-w-[1600px] items-center justify-center overflow-hidden border border-red-900/90 bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          src={redbackVideoSrc}
          poster={getVideoPosterSrc(redbackVideoSrc)}
          loop
          muted
          playsInline
          controls
        />
      </div>
    </section>
  );
}
