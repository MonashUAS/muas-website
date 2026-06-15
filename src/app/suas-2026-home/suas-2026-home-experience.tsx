"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Minus, Play, Plus } from "lucide-react";

type Feature = {
  title: string;
  body: string;
  model: string;
};

const FRAME_COUNT = 420;
const FRAME_PATH = "/images/redback-animation/hero%20frames/";

const features: Feature[] = [
  {
    title: "Autonomous Flight",
    body: "Redback is kitted with a dual-mode waypoint navigation system to achieve autonomous flight. Standard Waypoint Navigation flies expected routes seamlessly, while Guided Mode Control enables diversion from minimal waypoint plans, such as for patient detection, and is backed with a dynamic motion planner to perform live obstacle avoidance.",
    model: "/models/auto-flight.glb",
  },
  {
    title: "Endurance Optimisation",
    body: "Mission logic balances payload, battery load, cruise profile, and route efficiency so Redback can stay airborne longer while preserving enough reserve for changing conditions.",
    model: "/models/endurance.glb",
  },
  {
    title: "Risk Mapping",
    body: "Terrain, weather, obstacle, and search-priority data are fused into an operating map that helps the aircraft choose safer routes and focus attention where it matters most.",
    model: "/models/mapping.glb",
  },
  {
    title: "Patient Detection",
    body: "Onboard sensing and vision workflows support rapid patient localisation, giving operators clearer search context and faster confirmation during rescue missions.",
    model: "/models/detection.glb",
  },
  {
    title: "Safe Payload Deployment",
    body: "A controlled payload system positions and releases rescue supplies with precision, reducing risk to people on the ground while keeping the aircraft stable in flight.",
    model: "/models/lifeline.glb",
  },
];

function getFramePath(frame: number) {
  return `${FRAME_PATH}${String(frame).padStart(4, "0")}.png`;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function fadeRange(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start));
}

function ScrollHero() {
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

function VideoPlaceholder() {
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-black-500 px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(214,28,28,0.24),transparent_34%),linear-gradient(180deg,#050505_0%,#111_100%)]" />
      <div className="relative flex aspect-video w-full max-w-6xl items-center justify-center border border-red-700 bg-black-500/80 shadow-2xl">
        <button
          type="button"
          className="grid size-20 place-items-center border border-red-600 text-white transition-colors hover:bg-red-900/30"
          aria-label="Video placeholder"
        >
          <Play className="size-9 translate-x-0.5" aria-hidden />
        </button>
      </div>
    </section>
  );
}

function FeatureModel({ src }: { src: string }) {
  const gltf = useGLTF(src);

  return (
    <Bounds fit clip observe margin={1.35}>
      <Center>
        <primitive object={gltf.scene} />
      </Center>
    </Bounds>
  );
}

function ModelViewer({ model }: { model: string }) {
  return (
    <div className="relative h-[420px] min-h-[42vh] w-full lg:h-[620px]">
      <Canvas camera={{ position: [4, 2.2, 5], fov: 38 }} dpr={[1, 2]}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 6, 4]} intensity={2.4} />
        <directionalLight position={[-4, 1, -5]} intensity={0.9} color="#d61c1c" />
        <Suspense fallback={null}>
          <FeatureModel key={model} src={model} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableDamping makeDefault />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center text-caption uppercase text-white/55">
        Drag to rotate
      </div>
    </div>
  );
}

function KeyFeatures() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const activeFeature = useMemo(
    () => features.find((feature) => feature.title === expandedFeature),
    [expandedFeature],
  );
  const activeModel = activeFeature?.model ?? "/models/redback.glb";

  return (
    <section id="key-features" className="scroll-mt-10 bg-black-500 px-6 py-20 text-white lg:px-14">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(360px,0.9fr)_minmax(420px,1.2fr)] lg:items-center">
        <div>
          <p className="mb-4 text-subtitle text-red-400">Key Features</p>
          <div className="flex flex-col gap-5">
            {features.map((feature) => {
              const isExpanded = expandedFeature === feature.title;

              return (
                <div key={feature.title} className="grid grid-cols-[1fr_48px] gap-3">
                  <button
                    type="button"
                    className={`border border-red-700 px-4 py-3 text-left text-subtitle transition-colors hover:bg-red-950/40 ${
                      isExpanded ? "bg-red-950/35" : "bg-black-500"
                    }`}
                    onClick={() => setExpandedFeature(isExpanded ? null : feature.title)}
                    aria-expanded={isExpanded}
                    aria-controls={`${feature.title.replaceAll(" ", "-").toLowerCase()}-panel`}
                  >
                    {feature.title}
                  </button>
                  <button
                    type="button"
                    className="grid size-12 place-items-center border border-red-700 bg-black-500 text-white transition-colors hover:bg-red-950/40"
                    onClick={() => setExpandedFeature(isExpanded ? null : feature.title)}
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} ${feature.title}`}
                  >
                    {isExpanded ? <Minus className="size-5" /> : <Plus className="size-5" />}
                  </button>

                  {isExpanded ? (
                    <div
                      id={`${feature.title.replaceAll(" ", "-").toLowerCase()}-panel`}
                      className="col-span-2 border-x border-b border-red-700 bg-[linear-gradient(135deg,rgba(214,28,28,0.2),rgba(0,0,0,0.95)_56%)] px-4 pb-5 pt-3 text-b1 leading-6 text-white"
                    >
                      {feature.body}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <ModelViewer model={activeModel} />
      </div>
    </section>
  );
}

export function SUAS2026HomeExperience() {
  return (
    <div className="bg-black-500">
      <ScrollHero />
      <VideoPlaceholder />
      <KeyFeatures />
    </div>
  );
}
