"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getVideoPosterSrc } from "@/lib/media-paths";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const defaultPeregrineVideoSrc = "/videos/peregrine-video.mp4";

interface NFCVideoProps {
  videoSrc?: string;
  posterSrc?: string;
  title?: string;
}

/**
 * Renders the full-viewport Video section for Peregrine Mk II using a sleek blue theme.
 * Includes auto-play intersection management, visibility change tracking, motion preference support,
 * and matching playback settings with the Redback video section.
 */
export function NFCVideo({
  videoSrc = defaultPeregrineVideoSrc,
  posterSrc,
  title = "Peregrine Mk II",
}: NFCVideoProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isSectionVisibleRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hasError, setHasError] = useState(!videoSrc);

  const resolvedPoster = posterSrc ?? (videoSrc ? getVideoPosterSrc(videoSrc) : "/images/nfc-2025/nfc-group.webp");

  const pauseVideo = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion || document.hidden || hasError) {
      return;
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => setHasError(true));
    }
  }, [prefersReducedMotion, hasError]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !videoSrc) {
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
      { threshold: [0, 0.28, 0.5] }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      pauseVideo();
    };
  }, [pauseVideo, playVideo, videoSrc]);

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
      id="nfc-video"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-black px-0 py-10 text-white sm:px-6 sm:py-14 lg:px-8 lg:py-20"
    >
      {/* Blue Theme Radial Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_140%_50%_at_50%_50%,rgba(0,74,173,0.35)_0%,#000000_75%)]" />

      {/* Video Container Frame */}
      <div className="relative z-10 flex aspect-video w-full max-w-[1600px] items-center justify-center overflow-hidden border border-blue-900/90 bg-black shadow-[0_32px_100px_rgba(0,74,173,0.25)]">
        {videoSrc && !hasError ? (
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            src={videoSrc}
            poster={resolvedPoster}
            loop
            muted
            playsInline
            controls
            onError={() => setHasError(true)}
          />
        ) : (
          /* Video Placeholder State */
          <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-blue-950/40 p-6 text-center">
            <Image
              src={resolvedPoster}
              alt={`${title} Video Placeholder`}
              fill
              className="object-cover opacity-35 filter blur-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-blue-400/40 bg-blue-600/30 backdrop-blur-md">
                <svg
                  className="h-8 w-8 translate-x-0.5 text-blue-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h3 className="text-h6 font-semibold text-white sm:text-h5">
                {title} Video Showcase
              </h3>
              <p className="mt-2 max-w-md text-b2 text-blue-100/70 sm:text-b1">
                Video showcase coming soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
