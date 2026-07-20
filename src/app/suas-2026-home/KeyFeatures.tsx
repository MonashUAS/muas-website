"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
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
// Outside this centered hotspot, wheel input scrolls the page instead of zooming the model.
const MODEL_INTERACTION_HOTSPOT_WIDTH = 0.5;
const MODEL_INTERACTION_HOTSPOT_HEIGHT = 0.72;

// Loads and frames one GLB inside the shared model viewer canvas.
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

// Plays MP4 feature media automatically inside the same viewer frame.
function FeatureVideo({ src }: { src: string }) {
  return (
    <video
      key={src}
      className="absolute inset-0 z-10 h-full w-full object-cover"
      src={src}
      autoPlay
      loop
      muted
      playsInline
    />
  );
}

// Switches between model and video media inside the feature media stage.
export function ModelViewer({
  className,
  media,
  isDesktop,
}: {
  className?: string;
  media: KeyFeature["media"];
  isDesktop: boolean;
}) {
  const { progress } = useProgress();
  const modelSrc = media.type === "model" ? media.src : defaultMedia.src;
  const isModelLoading = media.type === "model" && progress < 100;

  useSuppressKnownThreeNoise();

  // On Mobile & Tablet: Replace 3D model with static Next.js Image for performance
  if (!isDesktop && media.type === "model") {
    return (
      <div className={`relative w-full overflow-hidden bg-black-500 ${className ?? ""}`}>
        <Image
          src="/models/redback.png"
          alt="Redback rendering"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="z-10 object-contain p-4 md:p-12"
          draggable={false}
        />
      </div>
    );
  }

  // On Desktop OR if video on either device: Render standard layout
  return (
    <div
      className={`w-full overflow-hidden bg-black-500 ${
        className ?? "relative h-[420px] min-h-[42vh] lg:h-[620px]"
      }`}
    >
      {isDesktop && media.type === "model" ? <ModelCanvas src={modelSrc} /> : null}

      {media.type === "video" ? <FeatureVideo src={media.src} /> : null}

      {isDesktop && media.type === "model" ? <ModelInteractionMask /> : null}

      {isDesktop && isModelLoading ? <ModelLoadingOverlay progress={progress} /> : null}

      {isDesktop && media.type === "model" ? (
        <div className="absolute inset-x-0 bottom-5 text-center text-caption uppercase text-white/55">
          <span>Drag to rotate</span>
          <span className="mx-2">|</span>
          <span>Scroll to zoom</span>
        </div>
      ) : null}
    </div>
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

// ModelLoadingOverlay mirrors the ScrollHero loader treatment for GLB loading.
function ModelLoadingOverlay({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-black-500 text-center text-white">
      <div>
        <p className="text-b1 uppercase tracking-[0.22em] text-white/70">
          Loading Redback
        </p>
        <p className="mt-3 text-h7">{Math.round(progress)}%</p>
      </div>
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
  const activeFeature = useMemo(
    () => keyFeatures.find((feature) => feature.title === expandedFeature),
    [expandedFeature],
  );
  const activeMedia = activeFeature?.media ?? defaultMedia;

  const [isDesktop, setIsDesktop] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Handlers for cycling features in mobile mode
  const handlePrevFeature = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!expandedFeature) return;
    const idx = keyFeatures.findIndex((f) => f.title === expandedFeature);
    const prevIdx = idx <= 0 ? keyFeatures.length - 1 : idx - 1;
    setExpandedFeature(keyFeatures[prevIdx].title);
  };

  const handleNextFeature = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!expandedFeature) return;
    const idx = keyFeatures.findIndex((f) => f.title === expandedFeature);
    const nextIdx = idx >= keyFeatures.length - 1 ? 0 : idx + 1;
    setExpandedFeature(keyFeatures[nextIdx].title);
  };

  return (
    <section
      id="key-features"
      className="relative scroll-mt-10 overflow-hidden bg-black-500 pb-12 md:pb-24 lg:pb-[calc(9rem+20px)] pt-12 text-white lg:pt-20"
    >
      {/* MOBILE / VERTICAL TABLET VIEW (Hidden on Desktop) */}
      <div className="flex w-full flex-col lg:hidden">
        <h2 className="mb-4 md:mb-8 px-5 sm:px-12 text-center text-[clamp(1.5rem,3vw,3rem)] font-medium leading-tight tracking-tighter text-white">
          Key Features
        </h2>

        {/* Media Block under title - Scaled to fit viewport cleanly */}
        <div className="relative w-full overflow-hidden h-[calc(100svh-12rem)] min-h-[550px] max-h-[850px] md:min-h-[700px] md:max-h-[1100px]">
          {mounted && (
            <ModelViewer
              isDesktop={false}
              media={activeMedia}
              className="absolute inset-0 h-full w-full"
            />
          )}

          {/* Close Feature Button over Media */}
          {expandedFeature && (
            <button
              onClick={() => setExpandedFeature(null)}
              className="absolute right-4 top-4 md:right-8 md:top-8 z-30 grid size-10 md:size-12 place-items-center rounded-full border border-red-300 bg-red-900/55 text-white backdrop-blur-md transition-colors hover:bg-red-800"
              aria-label="Close feature details"
            >
              <Minus className="size-5 md:size-6" />
            </button>
          )}

          {/* Bottom Nav / Feature Info Container */}
          <div className="absolute inset-x-0 bottom-6 md:bottom-10 z-20 px-4 sm:px-8 md:px-16">
            {expandedFeature && activeFeature ? (
              /* Active Feature Info Block - Reverted to separated floating chevrons */
              <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
                <button
                  onClick={handlePrevFeature}
                  className="flex flex-none items-center justify-center px-3 sm:px-5 md:px-6 transition-colors hover:text-white/70"
                  aria-label="Previous Feature"
                >
                  <ChevronLeft className="size-6 md:size-8 text-white" />
                </button>

                <div className="flex-1 px-4 py-4 sm:px-6 md:py-6 rounded-[2rem] border border-red-300/50 bg-[linear-gradient(180deg,rgba(214,28,28,0.22),rgba(0,0,0,0.88)_56%)] shadow-2xl backdrop-blur-md">
                  <h3 className="mb-1.5 md:mb-2 text-sm font-bold text-white sm:text-base md:text-lg">
                    {activeFeature.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-white/90 sm:text-sm md:text-base">
                    {activeFeature.body}
                  </p>
                </div>

                <button
                  onClick={handleNextFeature}
                  className="flex flex-none items-center justify-center px-3 sm:px-5 md:px-6 transition-colors hover:text-white/70"
                  aria-label="Next Feature"
                >
                  <ChevronRight className="size-6 md:size-8 text-white" />
                </button>
              </div>
            ) : (
              /* Default Horizontal Nav Block */
              <nav
                aria-label="Explore key features"
                className="mx-auto flex w-full max-w-max gap-2 overflow-x-auto sm:gap-3"
              >
                {keyFeatures.map((feature) => (
                  <button
                    key={feature.title}
                    type="button"
                    onClick={() => setExpandedFeature(feature.title)}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-red-700 bg-black/60 px-4 py-2.5 text-sm font-medium text-white/80 backdrop-blur-md transition-colors duration-300 hover:bg-red-900/60 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-200 sm:text-base md:text-lg md:px-6 md:py-3"
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
      <div className="relative mx-auto hidden min-h-[680px] w-full max-w-7xl px-14 lg:block lg:min-h-[720px]">
        {mounted && (
          <ModelViewer
            isDesktop={true}
            className="absolute inset-y-0 right-[calc(50%-50vw)] z-0 h-full w-[75vw]"
            media={activeMedia}
          />
        )}

        <div className="relative z-10 max-w-[31rem] pt-16">
          <h2 className="mb-10 pb-1 text-left text-[clamp(1.5rem,3vw,3rem)] font-medium leading-tight tracking-tighter text-white">
            Key Features
          </h2>
          <div className="flex flex-col gap-5">
            {keyFeatures.map((feature) => {
              const isExpanded = expandedFeature === feature.title;
              const panelId = getFeaturePanelId(feature.title) + "-desktop";

              return (
                <div key={feature.title} className="grid grid-cols-[1fr_auto] gap-3">
                  <button
                    type="button"
                    className={`h-12 rounded-full border px-5 text-left text-subtitle backdrop-blur-md transition-colors duration-300 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-200 motion-reduce:transition-none ${
                      isExpanded
                        ? "border-red-300 bg-red-900/55 text-white"
                        : "border-red-700 bg-black/45 text-white/80 hover:bg-red-900/55 hover:text-white"
                    }`}
                    onClick={() => setExpandedFeature(isExpanded ? null : feature.title)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                  >
                    {feature.title}
                  </button>

                  <button
                    type="button"
                    className={`grid size-12 place-items-center rounded-full border text-white backdrop-blur-md transition-colors duration-300 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-200 motion-reduce:transition-none ${
                      isExpanded
                        ? "border-red-300 bg-red-900/55"
                        : "border-red-700 bg-black/45 hover:bg-red-900/55"
                    }`}
                    onClick={() => setExpandedFeature(isExpanded ? null : feature.title)}
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
                      <div className="rounded-[1.25rem] border border-red-300 bg-[linear-gradient(180deg,rgba(214,28,28,0.22),rgba(0,0,0,0.88)_56%)] px-5 pb-5 pt-4 text-b1 leading-6 text-white backdrop-blur-md">
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