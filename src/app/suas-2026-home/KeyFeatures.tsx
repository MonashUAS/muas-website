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

import { keyFeatures } from "./key-features-data";
import type { KeyFeature } from "./key-features-data";

import LoadingScreen from "./LoadingScreen";

const sectionHeadingClass =
  "text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white";

const defaultMedia: KeyFeature["media"] = {
  src: "/models/redback.glb",
  type: "model",
};

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
  const gltf = useGLTF(src);

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
      <OrbitControls />
    </Canvas>
  );
}

function StaticModelFallback() {
  return (
    <Image
      src="/models/redback.png"
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
              <span className="mx-2">|</span>
              <span>Scroll to zoom</span>
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

  const displayedActiveFeature = useMemo(
    () => keyFeatures.find((feature) => feature.title === displayedFeature),
    [displayedFeature],
  );
  const displayedMedia = displayedActiveFeature?.media ?? defaultMedia;

  const canUseWebGL = useWebGLSupport();
  const mounted = useIsMounted();

  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

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

  const handlePrevFeature = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!expandedFeature) return;
    const idx = keyFeatures.findIndex((f) => f.title === expandedFeature);
    const prevIdx = idx <= 0 ? keyFeatures.length - 1 : idx - 1;
    toggleFeature(keyFeatures[prevIdx].title);
  };

  const handleNextFeature = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!expandedFeature) return;
    const idx = keyFeatures.findIndex((f) => f.title === expandedFeature);
    const nextIdx = idx >= keyFeatures.length - 1 ? 0 : idx + 1;
    toggleFeature(keyFeatures[nextIdx].title);
  };

  return (
    <section
      id="key-features"
      className="relative scroll-mt-10 overflow-hidden bg-black-500 pb-8 pt-12 text-white md:pb-10 lg:pb-8 lg:pt-14"
    >
      {/* MOBILE / VERTICAL TABLET VIEW (Hidden on Desktop) */}
      <div className="flex w-full flex-col lg:hidden">
        <h2 className={`mb-5 px-5 text-center sm:px-12 md:mb-8 ${sectionHeadingClass}`}>
          Key Features
        </h2>

        <div className="relative w-full overflow-hidden h-[calc(100svh-12rem)] min-h-[550px] max-h-[850px] md:min-h-[700px] md:max-h-[1100px]">
          {mounted && (
            <ModelViewer
              isDesktop={false}
              canUseWebGL={canUseWebGL}
              media={displayedMedia}
              isDissolving={isDissolving}
              className="absolute inset-0 h-full w-full"
            />
          )}

          <div
            className={`absolute right-4 top-4 z-40 transition-all duration-400 ease-out md:right-8 md:top-8 ${
              displayedFeature && !isDissolving
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-4 opacity-0"
            }`}
          >
            <button
              onClick={() => toggleFeature(null)}
              className="grid size-10 place-items-center rounded-full border border-red-300 bg-red-900/55 text-white backdrop-blur-md transition-colors hover:bg-red-800 md:size-12"
              aria-label="Close feature details"
            >
              <Minus className="size-5 md:size-6" />
            </button>
          </div>

          <div
            className={`absolute inset-x-0 bottom-6 z-30 px-4 transition-all duration-400 ease-out sm:px-8 md:bottom-10 md:px-16 ${
              isDissolving ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            {displayedFeature && displayedActiveFeature ? (
              <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
                <button
                  onClick={handlePrevFeature}
                  className="flex flex-none items-center justify-center px-3 transition-colors hover:text-white/70 sm:px-5 md:px-6"
                  aria-label="Previous Feature"
                >
                  <ChevronLeft className="size-6 text-white md:size-8" />
                </button>

                <div className="flex-1 rounded-[2rem] border border-red-300/50 bg-[linear-gradient(180deg,rgba(214,28,28,0.22),rgba(0,0,0,0.88)_56%)] px-4 py-4 shadow-2xl backdrop-blur-md sm:px-6 md:py-6">
                  <h3 className="mb-1.5 text-sm font-bold text-white sm:text-base md:mb-2 md:text-lg">
                    {displayedActiveFeature.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-white/90 sm:text-sm md:text-base">
                    {displayedActiveFeature.body}
                  </p>
                </div>

                <button
                  onClick={handleNextFeature}
                  className="flex flex-none items-center justify-center px-3 transition-colors hover:text-white/70 sm:px-5 md:px-6"
                  aria-label="Next Feature"
                >
                  <ChevronRight className="size-6 text-white md:size-8" />
                </button>
              </div>
            ) : (
              <nav
                aria-label="Explore key features"
                className="mx-auto flex w-full max-w-3xl flex-wrap justify-center gap-2 sm:gap-3"
              >
                {keyFeatures.map((feature) => (
                  <button
                    key={feature.title}
                    type="button"
                    onClick={() => toggleFeature(feature.title)}
                    className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-red-700 bg-black/60 px-3.5 py-2 text-xs font-medium text-white/80 backdrop-blur-md transition-colors duration-300 hover:bg-red-900/60 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-200 sm:px-4 sm:py-2.5 sm:text-sm md:min-h-12 md:px-6 md:py-3 md:text-base"
                  >
                    {feature.title}
                    <Plus className="size-4 md:size-5" aria-hidden />
                  </button>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW (Side-by-side, Hidden on Mobile) */}
      <div className="relative mx-auto hidden w-full max-w-[1720px] px-5 sm:px-8 lg:px-12 lg:block">
        {mounted && (
          <div className="absolute inset-y-0 right-0 z-0 h-full w-3/4">
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
                    className={`col-span-2 grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-out ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0">
                      <div className=" border border-red-300 bg-[linear-gradient(180deg,rgba(214,28,28,0.22),rgba(0,0,0,0.88)_56%)] px-5 pb-5 pt-4 text-b1 leading-6 text-white backdrop-blur-md">
                        {feature.body}
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
