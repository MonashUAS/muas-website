"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  Center,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Maximize2, Minimize2, Minus, Plus } from "lucide-react";

import { keyFeatures } from "./key-features-data";
import type { KeyFeature } from "./key-features-data";

const defaultMedia: KeyFeature["media"] = {
  src: "/models/redback.glb",
  type: "model",
};

// Loads and frames one GLB inside the shared model viewer canvas.
export function FeatureModel({ src }: { src: string }) {
  const gltf = useGLTF(src);

  return (
    <Bounds fit clip observe margin={1.35}>
      <Center>
        <primitive object={gltf.scene} />
      </Center>
    </Bounds>
  );
}

// Renders the interactive 3D canvas for GLB feature media.
function ModelCanvas({ src }: { src: string }) {
  return (
    <Canvas camera={{ position: [4, 2.2, 5], fov: 38 }} dpr={[1, 2]}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.04} />
      <directionalLight position={[5, 6, 4]} intensity={0.22} />
      <directionalLight position={[-4, 1, -5]} intensity={0.42} color="#d61c1c" />
      <Suspense fallback={null}>
        <FeatureModel key={src} src={src} />
        <Environment preset="city" />
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
      className="h-full w-full object-cover"
      src={src}
      autoPlay
      loop
      muted
      playsInline
    />
  );
}

// Switches between model and video media and exposes a fullscreen viewer control.
export function ModelViewer({ media }: { media: KeyFeature["media"] }) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const syncFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === viewerRef.current);
    };

    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  const toggleFullscreen = async () => {
    if (!viewerRef.current) {
      return;
    }

    if (document.fullscreenElement === viewerRef.current) {
      await document.exitFullscreen();
      return;
    }

    await viewerRef.current.requestFullscreen();
  };

  return (
    <div
      ref={viewerRef}
      className={`relative w-full overflow-hidden bg-black-500 ${
        isFullscreen ? "h-screen" : "h-[420px] min-h-[42vh] lg:h-[620px]"
      }`}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-10 grid size-11 place-items-center border border-white/35 bg-black/55 text-white backdrop-blur transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen viewer" : "View fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="size-5" aria-hidden />
        ) : (
          <Maximize2 className="size-5" aria-hidden />
        )}
      </button>

      {media.type === "video" ? (
        <FeatureVideo src={media.src} />
      ) : (
        <ModelCanvas src={media.src} />
      )}

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
      className="scroll-mt-10 bg-black-500 px-6 pb-28 pt-20 text-white lg:px-14 lg:pb-36"
    >
      <h2 className="mb-10 pb-1 text-center text-[clamp(1.5rem,3vw,3rem)] font-medium leading-tight tracking-tighter text-white">
        Key Features
      </h2>

      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(360px,0.9fr)_minmax(420px,1.2fr)] lg:items-center">
        <div>
          <div className="flex flex-col gap-5">
            {keyFeatures.map((feature) => {
              const isExpanded = expandedFeature === feature.title;
              const panelId = getFeaturePanelId(feature.title);

              return (
                <div key={feature.title} className="grid grid-cols-[1fr_48px] gap-3">
                  <button
                    type="button"
                    className={`border border-red-700 px-4 py-3 text-left text-subtitle transition-colors hover:cursor-pointer hover:bg-red-950/40 ${
                      isExpanded ? "bg-red-950/35" : "bg-black-500"
                    }`}
                    onClick={() => setExpandedFeature(isExpanded ? null : feature.title)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                  >
                    {feature.title}
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center border border-red-700 bg-black-500 p-4 text-white transition-colors hover:cursor-pointer hover:bg-red-950/40"
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
                      <div className="border border-b border-red-700 bg-[linear-gradient(180deg,rgba(214,28,28,0.2),rgba(0,0,0,0.95)_56%)] px-4 pb-5 pt-3 text-b1 leading-6 text-white">
                        {feature.body}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ModelViewer media={activeMedia} />
      </div>
    </section>
  );
}

// Creates a stable id shared by each feature button and its description panel.
function getFeaturePanelId(title: string) {
  return `${title.replaceAll(" ", "-").toLowerCase()}-panel`;
}
