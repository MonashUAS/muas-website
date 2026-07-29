"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  Center,
  Environment,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import {
  useSearchNavigation,
  useSearchRevealController,
} from "@/global-components/search/search-navigation-provider";
import { getVideoPosterSrc } from "@/lib/media-paths";

import { keyFeatures } from "./key-features-data";
import type { KeyFeature } from "./key-features-data";

import LoadingScreen from "./LoadingScreen";

const sectionHeadingClass =
  "text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white";

const defaultMedia: KeyFeature["media"] = {
  src: "/models/redback_web.glb",
  type: "model",
};
const defaultMobileFeatureTitle = keyFeatures[0]?.title ?? null;

// Tune MODEL_FRAME_MARGIN down to zoom in on initial load; tune it up to show more space around the model.
const MODEL_FRAME_MARGIN = 0.8;
const MODEL_CAMERA_POSITION: [number, number, number] = [10, 100, -220];

// Tune these lighting values to make GLB media brighter or darker.
const MODEL_AMBIENT_LIGHT = 0.1;
const MODEL_KEY_LIGHT = 2;
const MODEL_RED_RIM_LIGHT = 0.3;

// Tune these hotspot values to control how much of the model area accepts mouse zoom/drag.
const MODEL_INTERACTION_HOTSPOT_WIDTH = 0.5;
const MODEL_INTERACTION_HOTSPOT_HEIGHT = 0.72;

// Loads and frames one GLB inside the shared model viewer canvas using strict bounds matching.
export function FeatureModel({ src }: { src: string }) {
  const gltf = useGLTF(src, "https://www.gstatic.com/draco/v1/decoders/");

  return (
    <Bounds fit clip observe margin={MODEL_FRAME_MARGIN}>
      <Center>
        <primitive object={gltf.scene} />
      </Center>
    </Bounds>
  );
}

// Renders the interactive 3D canvas for GLB feature media.
function ModelCanvas({ src }: { src: string }) {
  return (
    <Canvas camera={{ position: MODEL_CAMERA_POSITION, fov: 38 }} dpr={[1, 2]}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={MODEL_AMBIENT_LIGHT} />
      <directionalLight position={[5, 6, 4]} intensity={MODEL_KEY_LIGHT} />
      <directionalLight
        position={[-4, 1, -5]}
        intensity={MODEL_RED_RIM_LIGHT}
        color="#d61c1c"
      />
      <Suspense fallback={null}>
        <FeatureModel key={src} src={src} />
        <Environment preset="night" />
      </Suspense>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}

function StaticModelFallback() {
  return (
    <Image
      src="/models/redback.webp"
      alt="Redback rendering"
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="object-contain p-4 md:p-12"
      draggable={false}
    />
  );
}

// Plays MP4 feature media automatically inside the same viewer frame.
function FeatureVideo({ src }: { src: string }) {
  return (
    <video
      key={src}
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={getVideoPosterSrc(src)}
      autoPlay
      loop
      muted
      playsInline
    />
  );
}

// Switches between model and video media smoothly without flashing.
export function ModelViewer({
  className,
  media,
  isDesktop,
  canUseWebGL,
  isDissolving = false,
}: {
  className?: string;
  media: KeyFeature["media"];
  isDesktop: boolean;
  canUseWebGL: boolean;
  isDissolving?: boolean;
}) {
  const { progress } = useProgress();
  const modelSrc = media.type === "model" ? media.src : defaultMedia.src;
  const canRenderModelCanvas = isDesktop && canUseWebGL;
  const isModelLoading = canRenderModelCanvas && media.type === "model" && progress < 100;

  useSuppressKnownThreeNoise();

  return (
    <div
      className={`w-full overflow-hidden bg-black-500 transition-all duration-500 ease-out ${
        isDissolving ? "opacity-30 blur-[6px]" : "opacity-100 blur-0"
      } ${className ?? "relative h-[420px] min-h-[42vh] lg:h-[620px]"}`}
    >
      {/* DESKTOP 3D MODEL LAYER */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-500 ${
          isDesktop ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {canRenderModelCanvas ? (
          <>
            <ModelCanvas src={modelSrc} />
            <ModelInteractionMask />
            {isModelLoading && <LoadingScreen progress={progress} />}
            <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center text-caption uppercase text-white/55">
              <span>Drag to rotate</span>
            </div>
          </>
        ) : (
          isDesktop && <StaticModelFallback />
        )}
      </div>

      {/* MOBILE / TABLET STATIC IMAGE LAYER */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-500 ${
          !isDesktop ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {!isDesktop && <StaticModelFallback />}
      </div>

      {/* OVERLAY VIDEO LAYER: Crossfades smoothly over base layers */}
      <div
        className={`absolute inset-0 z-20 bg-black-500 transition-opacity duration-500 ease-out ${
          media.type === "video" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {media.type === "video" && <FeatureVideo src={media.src} />}
      </div>
    </div>
  );
}

let webGLSupport: boolean | null = null;

function supportsWebGL() {
  if (typeof window === "undefined") return false;
  if (webGLSupport !== null) return webGLSupport;

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", {
      alpha: true,
      depth: true,
      stencil: false,
      antialias: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "default",
      failIfMajorPerformanceCaveat: false,
    });

    webGLSupport = Boolean(context);
    return webGLSupport;
  } catch {
    webGLSupport = false;
    return false;
  }
}

function useIsMounted() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

function useWebGLSupport() {
  return useSyncExternalStore(
    () => () => undefined,
    supportsWebGL,
    () => false,
  );
}

// ModelInteractionMask leaves only the center of the canvas interactive so gutters still scroll the page.
function ModelInteractionMask() {
  const horizontalInset = `${((1 - MODEL_INTERACTION_HOTSPOT_WIDTH) / 2) * 100}%`;
  const verticalInset = `${((1 - MODEL_INTERACTION_HOTSPOT_HEIGHT) / 2) * 100}%`;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      <div
        className="pointer-events-auto absolute inset-x-0 top-0"
        style={{ height: verticalInset }}
      />
      <div
        className="pointer-events-auto absolute inset-x-0 bottom-0"
        style={{ height: verticalInset }}
      />
      <div
        className="pointer-events-auto absolute bottom-0 left-0 top-0"
        style={{ width: horizontalInset }}
      />
      <div
        className="pointer-events-auto absolute bottom-0 right-0 top-0"
        style={{ width: horizontalInset }}
      />
    </div>
  );
}

// useSuppressKnownThreeNoise hides known third-party loader noise while the GLB still renders.
function useSuppressKnownThreeNoise() {
  useEffect(() => {
    const originalWarn = console.warn;
    const originalError = console.error;

    const shouldSuppress = (args: unknown[]) => {
      const message = args.map(String).join(" ");

      return (
        message.includes("THREE.Clock: This module has been deprecated") ||
        message.includes("THREE.GLTFLoader: Couldn't load texture blob:")
      );
    };

    console.warn = (...args: unknown[]) => {
      if (!shouldSuppress(args)) {
        originalWarn(...args);
      }
    };
    console.error = (...args: unknown[]) => {
      if (!shouldSuppress(args)) {
        originalError(...args);
      }
    };

    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);
}

// Coordinates feature expansion state and the active viewer media.
export function KeyFeatures() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [displayedFeature, setDisplayedFeature] = useState<string | null>(null);
  const [isDissolving, setIsDissolving] = useState(false);
  const transitionTimer = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const mobileSwipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastMobileSwipeAtRef = useRef(0);
  const { registerSearchTarget } = useSearchNavigation();

  const displayedActiveFeature = useMemo(
    () => keyFeatures.find((feature) => feature.title === displayedFeature),
    [displayedFeature],
  );
  const mobileActiveFeature = displayedActiveFeature ?? keyFeatures[0] ?? null;
  const displayedMedia = displayedActiveFeature?.media ?? defaultMedia;
  const mobileMedia = mobileActiveFeature?.media ?? defaultMedia;

  const canUseWebGL = useWebGLSupport();
  const mounted = useIsMounted();

  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  useSearchRevealController(
    "key-features",
    useMemo(
      () => ({
        reveal: (state) => {
          const accordionInteraction = state.interactions?.find(
            (interaction) =>
              interaction.type === "accordion" &&
              interaction.groupId === "key-features",
          );

          if (!accordionInteraction && state.expand?.id !== "key-features") {
            return;
          }

          const feature = keyFeatures.find(
            (item) =>
              item.slug ===
              (accordionInteraction?.value ?? state.expand?.itemId),
          );

          if (!feature) {
            return;
          }

          if (transitionTimer.current !== null) {
            window.clearTimeout(transitionTimer.current);
            transitionTimer.current = null;
          }

          setExpandedFeature(feature.title);
          setDisplayedFeature(feature.title);
          setIsDissolving(false);
        },
      }),
      [],
    ),
  );

  useEffect(() => {
    const activeFeature = displayedActiveFeature ?? mobileActiveFeature;

    if (!activeFeature || !sectionRef.current) {
      return;
    }

    const activePanel = Array.from(
      sectionRef.current.querySelectorAll<HTMLElement>(
        `[data-key-feature-slug="${activeFeature.slug}"]`,
      ),
    ).find((element) => element.getClientRects().length > 0);

    if (!activePanel) {
      return;
    }

    const cleanups = [
      registerSearchTarget(`key-feature-${activeFeature.slug}`, {
        element: activePanel,
        highlightMode: "component",
      }),
    ];

    activePanel
      .querySelectorAll<HTMLElement>("[data-search-target-id]")
      .forEach((element) => {
        const targetId = element.dataset.searchTargetId;

        if (!targetId) {
          return;
        }

        cleanups.push(
          registerSearchTarget(targetId, {
            element,
            highlightMode:
              element.dataset.searchHighlightMode === "text"
                ? "text"
                : "component",
          }),
        );
      });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [displayedActiveFeature, mobileActiveFeature, registerSearchTarget]);

  const toggleFeature = (title: string | null) => {
    if (title === expandedFeature) return;

    setExpandedFeature(title);
    setIsDissolving(true);

    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
    }

    // Matches the 400ms duration for a perfectly smooth crossfade dissolve
    transitionTimer.current = window.setTimeout(() => {
      setDisplayedFeature(title);
      setIsDissolving(false);
    }, 400);
  };

  const moveFeature = (direction: -1 | 1) => {
    const currentTitle =
      expandedFeature ?? displayedFeature ?? defaultMobileFeatureTitle;
    const currentIndex = keyFeatures.findIndex((feature) => feature.title === currentTitle);
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex =
      (safeIndex + direction + keyFeatures.length) % keyFeatures.length;

    toggleFeature(keyFeatures[nextIndex].title);
  };

  const handlePrevFeature = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveFeature(-1);
  };

  const handleNextFeature = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveFeature(1);
  };

  const startMobileSwipe = (x: number, y: number) => {
    mobileSwipeStartRef.current = {
      x,
      y,
    };
  };

  const finishMobileSwipe = (x: number, y: number) => {
    const start = mobileSwipeStartRef.current;
    mobileSwipeStartRef.current = null;

    if (!start) return;
    if (Date.now() - lastMobileSwipeAtRef.current < 350) return;

    const deltaX = x - start.x;
    const deltaY = y - start.y;
    const isHorizontalSwipe =
      Math.abs(deltaX) > 56 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35;

    if (!isHorizontalSwipe) return;

    lastMobileSwipeAtRef.current = Date.now();
    moveFeature(deltaX < 0 ? 1 : -1);
  };

  const handleMobilePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;

    startMobileSwipe(event.clientX, event.clientY);
  };

  const handleMobilePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    finishMobileSwipe(event.clientX, event.clientY);
  };

  const handleMobileTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    if (!touch) return;

    startMobileSwipe(touch.clientX, touch.clientY);
  };

  const handleMobileTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    if (!touch) return;

    finishMobileSwipe(touch.clientX, touch.clientY);
  };

  return (
    <section
      ref={sectionRef}
      id="key-features"
      className="relative scroll-mt-10 overflow-hidden bg-black-500 py-10 text-white sm:py-14 lg:py-20"
    >
      {/* MOBILE CAROUSEL VIEW (Hidden on Tablet/Desktop) */}
      <div
        className="flex w-full touch-pan-y flex-col px-4 sm:px-8 md:hidden"
        onPointerDown={handleMobilePointerDown}
        onPointerUp={handleMobilePointerUp}
        onTouchStart={handleMobileTouchStart}
        onTouchEnd={handleMobileTouchEnd}
      >
        <h2 className={`mb-4 text-center ${sectionHeadingClass}`}>
          Key Features
        </h2>

        <div className="mx-auto w-full max-w-3xl">
          {mounted && (
            <ModelViewer
              isDesktop={false}
              canUseWebGL={canUseWebGL}
              media={mobileMedia}
              isDissolving={isDissolving}
              className="relative h-[260px] w-full sm:h-[340px]"
            />
          )}
        </div>

        {mobileActiveFeature ? (
          <div
            id={`${getFeaturePanelId(mobileActiveFeature.title)}-mobile`}
            data-key-feature-slug={mobileActiveFeature.slug}
            className={`mx-auto mt-4 w-full max-w-2xl transition-all duration-400 ease-out ${
              isDissolving ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <div className="flex items-stretch justify-center gap-2">
              <button
                onClick={handlePrevFeature}
                className="flex min-h-12 flex-none items-center justify-center px-1.5 transition-colors hover:text-white/70"
                aria-label="Previous Feature"
              >
                <ChevronLeft className="size-7 text-white" />
              </button>

              <div className="flex min-h-[9.5rem] flex-1 flex-col justify-center rounded-[1.25rem] border border-red-300/50 bg-[linear-gradient(180deg,rgba(214,28,28,0.22),rgba(0,0,0,0.88)_56%)] px-4 py-4 shadow-2xl backdrop-blur-md">
                <h3
                  data-search-target-id={`key-feature-${mobileActiveFeature.slug}-heading`}
                  data-search-highlight-mode="text"
                  className="mb-1.5 text-sm font-bold text-white sm:text-base"
                >
                  {mobileActiveFeature.title}
                </h3>
                <p
                  data-search-target-id={`key-feature-${mobileActiveFeature.slug}-body`}
                  data-search-highlight-mode="text"
                  className="text-xs leading-relaxed text-white/90 sm:text-sm"
                >
                  {mobileActiveFeature.body}
                </p>
              </div>

              <button
                onClick={handleNextFeature}
                className="flex min-h-12 flex-none items-center justify-center px-1.5 transition-colors hover:text-white/70"
                aria-label="Next Feature"
              >
                <ChevronRight className="size-7 text-white" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* TABLET VIEW (Hidden on Mobile/Desktop) */}
      <div className="hidden w-full flex-col px-4 sm:px-8 md:flex md:px-12 lg:hidden">
        <h2 className={`mb-6 text-center ${sectionHeadingClass}`}>
          Key Features
        </h2>

        <div className="mx-auto w-full max-w-3xl">
          {mounted && (
            <ModelViewer
              isDesktop={false}
              canUseWebGL={canUseWebGL}
              media={displayedMedia}
              isDissolving={isDissolving}
              className="relative h-[430px] w-full"
            />
          )}
        </div>

        <nav
          aria-label="Explore key features"
          className="mx-auto mt-6 flex w-full max-w-3xl flex-wrap justify-center gap-3"
        >
          {keyFeatures.map((feature) => {
            const isExpanded = expandedFeature === feature.title;

            return (
              <button
                key={feature.title}
                type="button"
                data-search-target-id={`key-feature-${feature.slug}-heading`}
                data-search-highlight-mode="text"
                onClick={() => toggleFeature(isExpanded ? null : feature.title)}
                className={`flex min-h-12 shrink-0 items-center gap-1.5 rounded-full border px-6 py-3 text-base font-medium backdrop-blur-md transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-200 ${
                  isExpanded
                    ? "border-red-300 bg-red-900/55 text-white"
                    : "border-red-700 bg-black/60 text-white/80 hover:bg-red-900/60"
                }`}
                aria-expanded={isExpanded}
                aria-controls={`${getFeaturePanelId(feature.title)}-mobile`}
              >
                {feature.title}
                {isExpanded ? (
                  <Minus className="size-5" aria-hidden />
                ) : (
                  <Plus className="size-5" aria-hidden />
                )}
              </button>
            );
          })}
        </nav>

        {displayedFeature && displayedActiveFeature ? (
          <div
            id={`${getFeaturePanelId(displayedActiveFeature.title)}-mobile`}
            data-key-feature-slug={displayedActiveFeature.slug}
            className={`mx-auto mt-4 w-full max-w-2xl transition-all duration-400 ease-out md:mt-5 ${
              isDissolving ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <div className="flex items-stretch justify-center gap-2 sm:gap-4">
              <button
                onClick={handlePrevFeature}
                className="flex flex-none items-center justify-center px-4 transition-colors hover:text-white/70"
                aria-label="Previous Feature"
              >
                <ChevronLeft className="size-8 text-white" />
              </button>

              <div className="flex-1 rounded-[1.25rem] border border-red-300/50 bg-[linear-gradient(180deg,rgba(214,28,28,0.22),rgba(0,0,0,0.88)_56%)] px-6 py-5 shadow-2xl backdrop-blur-md">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3
                    data-search-target-id={`key-feature-${displayedActiveFeature.slug}-heading`}
                    data-search-highlight-mode="text"
                    className="text-lg font-bold text-white"
                  >
                    {displayedActiveFeature.title}
                  </h3>
                  <button
                    onClick={() => toggleFeature(null)}
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-red-300/50 bg-red-900/35 text-white transition-colors hover:bg-red-800"
                    aria-label="Close feature details"
                  >
                    <Minus className="size-5" />
                  </button>
                </div>
                <p
                  data-search-target-id={`key-feature-${displayedActiveFeature.slug}-body`}
                  data-search-highlight-mode="text"
                  className="text-base leading-relaxed text-white/90"
                >
                  {displayedActiveFeature.body}
                </p>
              </div>

              <button
                onClick={handleNextFeature}
                className="flex flex-none items-center justify-center px-4 transition-colors hover:text-white/70"
                aria-label="Next Feature"
              >
                <ChevronRight className="size-8 text-white" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* DESKTOP VIEW (Side-by-side, Hidden on Mobile) */}
      <div className="relative mx-auto hidden w-full max-w-[1720px] flex-1 flex-col justify-center px-5 sm:px-8 lg:flex lg:px-12">
        {mounted && (
          <div className="absolute inset-y-0 right-0 z-0 h-full w-3/4 min-h-[500px]">
            <ModelViewer
              isDesktop={true}
              canUseWebGL={canUseWebGL}
              className="h-full w-full"
              media={displayedMedia}
              isDissolving={isDissolving}
            />
          </div>
        )}

        <div className="relative z-10 max-w-[31rem] pt-10">
          <h2 className={`mb-8 text-left ${sectionHeadingClass}`}>
            Key Features
          </h2>
          <div className="flex flex-col gap-4">
            {keyFeatures.map((feature) => {
              const isExpanded = expandedFeature === feature.title;
              const panelId = getFeaturePanelId(feature.title) + "-desktop";

              return (
                <div key={feature.title} className="grid grid-cols-[1fr_auto] gap-3">
                  <button
                    type="button"
                    data-search-target-id={`key-feature-${feature.slug}-heading`}
                    data-search-highlight-mode="text"
                    className={`h-12 border px-5 text-left text-subtitle backdrop-blur-md transition-colors duration-300 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-200 motion-reduce:transition-none ${
                      isExpanded
                        ? "border-red-300 bg-red-900/55 text-white"
                        : "border-red-700 bg-black/45 text-white/80 hover:bg-red-900/55 hover:text-white"
                    }`}
                    onClick={() => toggleFeature(isExpanded ? null : feature.title)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                  >
                    {feature.title}
                  </button>

                  <button
                    type="button"
                    className={`grid size-12 place-items-center border text-white backdrop-blur-md transition-colors duration-300 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-200 motion-reduce:transition-none ${
                      isExpanded
                        ? "border-red-300 bg-red-900/55"
                        : "border-red-700 bg-black/45 hover:bg-red-900/55"
                    }`}
                    onClick={() => toggleFeature(isExpanded ? null : feature.title)}
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} ${feature.title}`}
                  >
                    {isExpanded ? (
                      <Minus className="size-5" aria-hidden />
                    ) : (
                      <Plus className="size-5" aria-hidden />
                    )}
                  </button>

                  <div
                    id={panelId}
                    data-key-feature-slug={feature.slug}
                    className={`col-span-2 grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-out ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0">
                      <div className=" border border-red-300 bg-[linear-gradient(180deg,rgba(214,28,28,0.22),rgba(0,0,0,0.88)_56%)] px-5 pb-5 pt-4 text-b1 leading-6 text-white backdrop-blur-md">
                        <span
                          data-search-target-id={`key-feature-${feature.slug}-body`}
                          data-search-highlight-mode="text"
                        >
                        {feature.body}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Creates a stable id shared by each feature button and its description panel.
function getFeaturePanelId(title: string) {
  return `${title.replaceAll(" ", "-").toLowerCase()}-panel`;
}

useGLTF.preload(
  defaultMedia.src,
  "https://www.gstatic.com/draco/v1/decoders/",
);
