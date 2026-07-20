"use client";

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
import { Minus, Plus } from "lucide-react";

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
}: {
  className?: string;
  media: KeyFeature["media"];
}) {
  const { progress } = useProgress();
  const modelSrc = media.type === "model" ? media.src : defaultMedia.src;
  const isModelLoading = media.type === "model" && progress < 100;

  useSuppressKnownThreeNoise();

  return (
    <div
      className={`w-full overflow-hidden bg-black-500 ${
        className ?? "relative h-[420px] min-h-[42vh] lg:h-[620px]"
      }`}
    >
      <ModelCanvas src={modelSrc} />

      {media.type === "video" ? (
        <FeatureVideo src={media.src} />
      ) : null}

      {media.type === "model" ? <ModelInteractionMask /> : null}

      {isModelLoading ? <ModelLoadingOverlay progress={progress} /> : null}

      {media.type === "model" ? (
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

  return (
    <section
      id="key-features"
      className="relative scroll-mt-10 overflow-hidden bg-black-500 px-6 pb-[calc(7rem+20px)] pt-20 text-white lg:px-14 lg:pb-[calc(9rem+20px)]"
    >
      

      <div className="relative mx-auto min-h-[680px] w-full max-w-7xl lg:min-h-[720px]">
        <ModelViewer
          className="absolute inset-y-0 right-[-1.5rem] z-0 h-full w-[calc(100%+3rem)] lg:right-[calc(50%-50vw)] lg:w-[75vw]"
          media={activeMedia}
        />

        <div className="relative z-10 max-w-xl pt-10 lg:max-w-[31rem] lg:pt-16">
          <h2 className="mb-10 pb-1 text-left text-[clamp(1.5rem,3vw,3rem)] font-medium leading-tight tracking-tighter text-white">
            Key Features
          </h2>
          <div className="flex flex-col gap-5">
            {keyFeatures.map((feature) => {
              const isExpanded = expandedFeature === feature.title;
              const panelId = getFeaturePanelId(feature.title);

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
