"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchableText } from "@/global-components/search/searchable-text";
import { heroSlides } from "../data/hero-slides";
import { usePrefersReducedMotion } from "../utils/use-prefers-reduced-motion";

const IMAGE_DURATION_MS = 5000;
const MEDIA_TRANSITION_MS = 1000;
const HAVE_METADATA = 1;
const HAVE_FUTURE_DATA = 3;
const VIDEO_READY_TIMEOUT_MS = 8000;
const VIDEO_FRAME_TIMEOUT_MS = 1200;

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callback: (now: DOMHighResTimeStamp, metadata: unknown) => void,
  ) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

function waitForVideoEvent(
  video: HTMLVideoElement,
  eventName: string,
  timeoutMs = VIDEO_READY_TIMEOUT_MS,
) {
  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for hero video ${eventName}.`));
    }, timeoutMs);
    const cleanup = () => {
      window.clearTimeout(timeout);
      video.removeEventListener(eventName, handleEvent);
      video.removeEventListener("error", handleError);
    };
    const handleEvent = () => {
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(new Error(`Hero video failed before ${eventName}.`));
    };

    video.addEventListener(eventName, handleEvent, { once: true });
    video.addEventListener("error", handleError, { once: true });
  });
}

function waitForDecodedFrame(video: HTMLVideoElement) {
  const videoWithFrameCallback = video as VideoWithFrameCallback;

  return new Promise<void>((resolve) => {
    if (videoWithFrameCallback.requestVideoFrameCallback) {
      const timeout = window.setTimeout(() => {
        if (videoWithFrameCallback.cancelVideoFrameCallback) {
          videoWithFrameCallback.cancelVideoFrameCallback(callbackHandle);
        }

        resolve();
      }, VIDEO_FRAME_TIMEOUT_MS);
      const callbackHandle = videoWithFrameCallback.requestVideoFrameCallback(
        () => {
          window.clearTimeout(timeout);
          resolve();
        },
      );

      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

async function resetVideoToStart(video: HTMLVideoElement) {
  if (video.readyState < HAVE_METADATA) {
    video.load();
    await waitForVideoEvent(video, "loadedmetadata");
  }

  if (Math.abs(video.currentTime) > 0.05) {
    video.currentTime = 0;
    await waitForVideoEvent(video, "seeked");
  } else {
    video.currentTime = 0;
  }

  if (video.readyState < HAVE_FUTURE_DATA) {
    await waitForVideoEvent(video, "canplay");
  }
}

async function startHiddenPlayback(video: HTMLVideoElement) {
  const playPromise = video.play();

  if (playPromise !== undefined) {
    await playPromise;
  }

  if (video.paused) {
    await waitForVideoEvent(video, "playing");
  }

  await waitForDecodedFrame(video);
}

async function warmVideo(video: HTMLVideoElement) {
  await resetVideoToStart(video);
  await startHiddenPlayback(video);
  video.pause();
  await resetVideoToStart(video);
}

async function prepareVideoForReveal(video: HTMLVideoElement) {
  await resetVideoToStart(video);
  await startHiddenPlayback(video);
}

// The homepage hero owns only slideshow behavior; slide content lives in data
// so the media sequence can be updated without touching interaction code.
export function HomepageHero() {
  const [requestedSlide, setRequestedSlide] = useState(0);
  const [visibleSlide, setVisibleSlide] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const hasPreloadedVideosRef = useRef(false);
  const warmedVideoIndexesRef = useRef(new Set<number>());
  const goToNextSlide = useCallback(() => {
    setRequestedSlide((currentIndex) => (currentIndex + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (hasPreloadedVideosRef.current) {
      return;
    }

    hasPreloadedVideosRef.current = true;
    videoRefs.current.forEach((video) => {
      video?.load();
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || requestedSlide !== visibleSlide) {
      return;
    }

    const visibleSlideData = heroSlides[visibleSlide];

    if (!visibleSlideData || visibleSlideData.type !== "image") {
      return;
    }

    let isCancelled = false;

    const warmUpcomingVideos = async () => {
      for (const [index, slide] of heroSlides.entries()) {
        if (
          isCancelled ||
          slide.type !== "video" ||
          warmedVideoIndexesRef.current.has(index)
        ) {
          continue;
        }

        const video = videoRefs.current[index];

        if (!video) {
          continue;
        }

        try {
          await warmVideo(video);

          if (!isCancelled) {
            warmedVideoIndexesRef.current.add(index);
          }
        } catch {
          warmedVideoIndexesRef.current.delete(index);
        }
      }
    };

    void warmUpcomingVideos();

    return () => {
      isCancelled = true;
    };
  }, [prefersReducedMotion, requestedSlide, visibleSlide]);

  useEffect(() => {
    if (prefersReducedMotion || requestedSlide === visibleSlide) {
      return;
    }

    const incomingSlide = heroSlides[requestedSlide];

    if (!incomingSlide || incomingSlide.type === "image") {
      const animationFrame = window.requestAnimationFrame(() => {
        setVisibleSlide(requestedSlide);
      });

      return () => window.cancelAnimationFrame(animationFrame);
    }

    const video = videoRefs.current[requestedSlide];

    if (!video) {
      goToNextSlide();
      return;
    }

    let isCancelled = false;

    const prepareIncomingVideo = async () => {
      try {
        await prepareVideoForReveal(video);

        if (!isCancelled) {
          setVisibleSlide(requestedSlide);
        }
      } catch {
        if (!isCancelled) {
          goToNextSlide();
        }
      }
    };

    void prepareIncomingVideo();

    return () => {
      isCancelled = true;
    };
  }, [goToNextSlide, prefersReducedMotion, requestedSlide, visibleSlide]);

  // Image slides advance by fixed timer; video slides advance onEnded.
  useEffect(() => {
    if (prefersReducedMotion || requestedSlide !== visibleSlide) {
      return;
    }

    const visibleSlideData = heroSlides[visibleSlide];

    if (!visibleSlideData || visibleSlideData.type !== "image") {
      return;
    }

    const timeout = window.setTimeout(goToNextSlide, IMAGE_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [goToNextSlide, prefersReducedMotion, requestedSlide, visibleSlide]);

  useEffect(() => {
    const visibleSlideData = heroSlides[visibleSlide];

    if (
      prefersReducedMotion ||
      requestedSlide !== visibleSlide ||
      !visibleSlideData ||
      visibleSlideData.type !== "video"
    ) {
      return;
    }

    const video = videoRefs.current[visibleSlide];

    if (!video) {
      return;
    }

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        goToNextSlide();
      });
    }
  }, [goToNextSlide, prefersReducedMotion, requestedSlide, visibleSlide]);

  useEffect(() => {
    if (prefersReducedMotion) {
      videoRefs.current.forEach((video) => video?.pause());
      return;
    }

    const timeout = window.setTimeout(() => {
      videoRefs.current.forEach((video, index) => {
        if (index !== visibleSlide) {
          video?.pause();
        }
      });
    }, MEDIA_TRANSITION_MS);

    return () => window.clearTimeout(timeout);
  }, [prefersReducedMotion, visibleSlide]);

  const handleMediaError = useCallback(
    (index: number) => {
      // If the active asset fails to load, skip forward so one file cannot freeze the hero.
      if (
        !prefersReducedMotion &&
        (index === requestedSlide || index === visibleSlide)
      ) {
        goToNextSlide();
      }
    },
    [goToNextSlide, prefersReducedMotion, requestedSlide, visibleSlide],
  );

  const handleVideoEnded = useCallback(
    (index: number) => {
      // Videos advance from their natural ended event instead of replaying indefinitely.
      if (
        !prefersReducedMotion &&
        index === visibleSlide &&
        requestedSlide === visibleSlide
      ) {
        goToNextSlide();
      }
    },
    [goToNextSlide, prefersReducedMotion, requestedSlide, visibleSlide],
  );

  return (
    <section
      id="homepage-hero"
      className="relative viewport-fold scroll-mt-20 overflow-hidden bg-black-500 text-white"
    >
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => {
          const isActive = index === visibleSlide;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              {slide.type === "image" ? (
                // next/image optimizes still media; videos stay native for autoplay support.
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                  onError={() => handleMediaError(index)}
                />
              ) : (
                <video
                  ref={(element) => {
                    videoRefs.current[index] = element;
                  }}
                  src={slide.src}
                  muted
                  playsInline
                  preload="auto"
                  className="h-full w-full object-cover"
                  onEnded={() => handleVideoEnded(index)}
                  onError={() => handleMediaError(index)}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(0,31,73,0.76)_0%,rgba(2,4,10,0.48)_45%,rgba(5,8,13,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(84,134,200,0.22),transparent_32%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,rgba(0,0,0,0.64),transparent)]" />

      <div className="relative z-10 mx-auto flex viewport-fold w-full max-w-6xl -translate-y-12 flex-col items-center justify-center px-6 py-20 text-center sm:px-8 lg:px-12">
        <Image
          src="/logos/logo-with-text.svg"
          alt="MUAS Logo"
          width={260}
          height={74}
          priority
          className="h-auto w-[190px] sm:w-[240px] lg:w-[280px]"
        />

        <SearchableText
          as="p"
          searchId="home-hero-heading"
          className="mt-8 text-[clamp(2.4rem,7vw,5.6rem)] font-black leading-[0.95] tracking-[-0.05em] text-white"
        >
          Redefining Drone Technology
        </SearchableText>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/our-drones"
            data-search-target-id="home-hero-explore-drones"
            data-search-highlight-mode="text"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-b1 text-blue-900 transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
          >
            Explore Our Drones
          </Link>
          <Link
            href="/recruitment"
            data-search-target-id="home-hero-join-team"
            data-search-highlight-mode="text"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#051b5e] px-6 text-b1 text-white transition-colors duration-300 hover:bg-[#0b2a7a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
          >
            Join The Team
          </Link>
        </div>
      </div>
    </section>
  );
}
