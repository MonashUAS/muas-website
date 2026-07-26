"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_IMAGE_DURATION_MS = 5000;
const DEFAULT_MEDIA_TRANSITION_MS = 1000;
const HAVE_METADATA = 1;
const HAVE_FUTURE_DATA = 3;
const VIDEO_READY_TIMEOUT_MS = 8000;
const VIDEO_FRAME_TIMEOUT_MS = 1200;

type PreparedMediaSlide = {
  id: string;
  src: string;
  type: "image" | "video";
};

type UsePreparedMediaSlideshowOptions<TSlide extends PreparedMediaSlide> = {
  slides: TSlide[];
  prefersReducedMotion: boolean;
  imageDurationMs?: number;
  mediaTransitionMs?: number;
  rootMargin?: string;
};

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
      reject(new Error(`Timed out waiting for slideshow video ${eventName}.`));
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
      reject(new Error(`Slideshow video failed before ${eventName}.`));
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

function getMountedSlideIndexes(
  visibleSlide: number,
  requestedSlide: number,
  slideCount: number,
) {
  const indexes = new Set<number>([visibleSlide, requestedSlide]);

  if (slideCount > 1) {
    indexes.add((visibleSlide + 1) % slideCount);
    indexes.add((visibleSlide - 1 + slideCount) % slideCount);
    indexes.add((requestedSlide + 1) % slideCount);
    indexes.add((requestedSlide - 1 + slideCount) % slideCount);
  }

  return indexes;
}

export function usePreparedMediaSlideshow<TSlide extends PreparedMediaSlide>({
  slides,
  prefersReducedMotion,
  imageDurationMs = DEFAULT_IMAGE_DURATION_MS,
  mediaTransitionMs = DEFAULT_MEDIA_TRANSITION_MS,
  rootMargin = "80px 0px",
}: UsePreparedMediaSlideshowOptions<TSlide>) {
  const [requestedSlide, setRequestedSlide] = useState(0);
  const [visibleSlide, setVisibleSlide] = useState(0);
  const [isInView, setIsInView] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [decodedImageIndexes, setDecodedImageIndexes] = useState<Set<number>>(
    () => new Set(),
  );
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const warmedVideoIndexesRef = useRef(new Set<number>());
  const slideSignature = slides.map((slide) => slide.id).join("|");
  const hasMultipleSlides = slides.length > 1;

  const goToNextSlide = useCallback(() => {
    setRequestedSlide((currentIndex) =>
      slides.length > 0 ? (currentIndex + 1) % slides.length : 0,
    );
  }, [slides.length]);

  const handleImageDecoded = useCallback((index: number) => {
    setDecodedImageIndexes((currentIndexes) => {
      if (currentIndexes.has(index)) {
        return currentIndexes;
      }

      const nextIndexes = new Set(currentIndexes);
      nextIndexes.add(index);
      return nextIndexes;
    });
  }, []);

  const registerVideoRef = useCallback(
    (index: number) => (element: HTMLVideoElement | null) => {
      videoRefs.current[index] = element;
    },
    [],
  );

  useEffect(() => {
    setRequestedSlide(0);
    setVisibleSlide(0);
    setDecodedImageIndexes(new Set());
    warmedVideoIndexesRef.current.clear();
    videoRefs.current = [];
  }, [slideSignature]);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    const syncVisibility = () => {
      setIsDocumentVisible(document.visibilityState !== "hidden");
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);

    return () => {
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (
      !hasMultipleSlides ||
      prefersReducedMotion ||
      requestedSlide !== visibleSlide
    ) {
      return;
    }

    const nextIndex = (visibleSlide + 1) % slides.length;
    const nextSlide = slides[nextIndex];

    if (
      !nextSlide ||
      nextSlide.type !== "video" ||
      warmedVideoIndexesRef.current.has(nextIndex)
    ) {
      return;
    }

    const video = videoRefs.current[nextIndex];

    if (!video) {
      return;
    }

    let isCancelled = false;

    const warmUpcomingVideo = async () => {
      try {
        await warmVideo(video);

        if (!isCancelled) {
          warmedVideoIndexesRef.current.add(nextIndex);
        }
      } catch {
        warmedVideoIndexesRef.current.delete(nextIndex);
      }
    };

    void warmUpcomingVideo();

    return () => {
      isCancelled = true;
    };
  }, [
    hasMultipleSlides,
    prefersReducedMotion,
    requestedSlide,
    slideSignature,
    slides,
    visibleSlide,
  ]);

  useEffect(() => {
    if (
      !hasMultipleSlides ||
      prefersReducedMotion ||
      requestedSlide === visibleSlide
    ) {
      return;
    }

    const incomingSlide = slides[requestedSlide];

    if (!incomingSlide) {
      return;
    }

    if (incomingSlide.type === "image") {
      if (!decodedImageIndexes.has(requestedSlide)) {
        return;
      }

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
  }, [
    decodedImageIndexes,
    goToNextSlide,
    hasMultipleSlides,
    prefersReducedMotion,
    requestedSlide,
    slides,
    visibleSlide,
  ]);

  useEffect(() => {
    if (
      !hasMultipleSlides ||
      prefersReducedMotion ||
      requestedSlide !== visibleSlide ||
      !isInView ||
      !isDocumentVisible
    ) {
      return;
    }

    const visibleSlideData = slides[visibleSlide];

    if (!visibleSlideData || visibleSlideData.type !== "image") {
      return;
    }

    const timeout = window.setTimeout(goToNextSlide, imageDurationMs);

    return () => window.clearTimeout(timeout);
  }, [
    goToNextSlide,
    hasMultipleSlides,
    imageDurationMs,
    isDocumentVisible,
    isInView,
    prefersReducedMotion,
    requestedSlide,
    slides,
    visibleSlide,
  ]);

  useEffect(() => {
    const visibleSlideData = slides[visibleSlide];

    if (
      !hasMultipleSlides ||
      prefersReducedMotion ||
      requestedSlide !== visibleSlide ||
      !visibleSlideData ||
      visibleSlideData.type !== "video" ||
      !isInView ||
      !isDocumentVisible
    ) {
      const video = videoRefs.current[visibleSlide];
      video?.pause();
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
  }, [
    goToNextSlide,
    hasMultipleSlides,
    isDocumentVisible,
    isInView,
    prefersReducedMotion,
    requestedSlide,
    slides,
    visibleSlide,
  ]);

  useEffect(() => {
    if (prefersReducedMotion || !hasMultipleSlides) {
      videoRefs.current.forEach((video) => video?.pause());
      return;
    }

    const timeout = window.setTimeout(() => {
      videoRefs.current.forEach((video, index) => {
        if (index !== visibleSlide) {
          video?.pause();
        }
      });
    }, mediaTransitionMs);

    return () => window.clearTimeout(timeout);
  }, [hasMultipleSlides, mediaTransitionMs, prefersReducedMotion, visibleSlide]);

  const handleMediaError = useCallback(
    (index: number) => {
      if (
        hasMultipleSlides &&
        !prefersReducedMotion &&
        (index === requestedSlide || index === visibleSlide)
      ) {
        goToNextSlide();
      }
    },
    [
      goToNextSlide,
      hasMultipleSlides,
      prefersReducedMotion,
      requestedSlide,
      visibleSlide,
    ],
  );

  const handleVideoEnded = useCallback(
    (index: number) => {
      if (
        hasMultipleSlides &&
        !prefersReducedMotion &&
        index === visibleSlide &&
        requestedSlide === visibleSlide
      ) {
        goToNextSlide();
      }
    },
    [
      goToNextSlide,
      hasMultipleSlides,
      prefersReducedMotion,
      requestedSlide,
      visibleSlide,
    ],
  );

  const mountedSlideIndexes = useMemo(
    () => getMountedSlideIndexes(visibleSlide, requestedSlide, slides.length),
    [requestedSlide, slides.length, visibleSlide],
  );

  return {
    handleImageDecoded,
    handleMediaError,
    handleVideoEnded,
    hasMultipleSlides,
    mountedSlideIndexes,
    registerVideoRef,
    requestedSlide,
    sectionRef,
    visibleSlide,
  };
}
