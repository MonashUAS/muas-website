"use client";

import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Minus, Plus } from "lucide-react";

// Type definition for a feature, including its title, description, and associated 3D model path
type Feature = {
  title: string;
  body: string;
  model: string;
};

// List of key features, each with a title, description, and associated 3D model
const features: Feature[] = [
  {
    title: "Autonomous Flight",
    body: "Redback is kitted with a dual-mode waypoint navigation system to achieve autonomous flight. Standard Waypoint Navigation flies expected routes seamlessly, while Guided Mode Control enables diversion from minimal waypoint plans, such as for patient detection, and is backed with a dynamic motion planner to perform live obstacle avoidance.",
    model: "/models/auto-flight.glb",
  },
  {
    title: "Endurance Optimisation",
    body: "Equipped with four high efficiency motors and custom propellers, Redback is optimised to fly further and faster. To ensure the aircraft has the power to fly endurance missions, 6 100Wh 6S batteries are placed in cells of 2, replicating 3 12S batteries.",
    model: "/models/endurance.glb",
  },
  {
    title: "Risk Mapping",
    body: "A series of photos is captured with the onboard camera while flying in a predetermined path. An image stitching algorithm generates a high quality total view of the search boundary.",
    model: "/models/mapping.glb",
  },
  {
    title: "Patient Detection",
    body: "An advanced object detection model processes the camera feed to identify and pinpoint the exact coordinates of a person or a tent.",
    model: "/models/detection.glb",
  },
  {
    title: "Safe Payload Deployment",
    body: "Redback's passive resistive braking system ensures a controlled, tethered payload release, allowing the bottle and beacon to be delivered to aid a person in need in no time.",
    model: "/models/lifeline.glb",
  },
];

// Component for rendering individual feature models
export function FeatureModel({ src }: { src: string }) {
  const gltf = useGLTF(src);

  return (
    // Bounds is used to automatically frame the model in the view, with a margin for better aesthetics
    <Bounds fit clip observe margin={1.35}>
      <Center>
        <primitive object={gltf.scene} /> 
      </Center>
    </Bounds>
  );
}

// Component for rendering the 3D model viewer with controls
export function ModelViewer({ model }: { model: string }) {
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
        <OrbitControls />
      </Canvas>
      <div className="absolute inset-x-0 bottom-5 text-center text-caption uppercase text-white/55">
        <span>Drag to rotate</span>
        <span className="mx-2">|</span>
        <span>Scroll to zoom</span>
      </div>
    </div>
  );
}

// Main component for the Key Features section, managing state for expanded features and rendering the model viewer
export function KeyFeatures() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const activeFeature = useMemo(
    () => features.find((feature) => feature.title === expandedFeature),
    [expandedFeature],
  );
  const activeModel = activeFeature?.model ?? "/models/redback.glb"; //

  return (
    <section id="key-features" className="scroll-mt-10 bg-black-500 px-6 py-20 text-white lg:px-14">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(360px,0.9fr)_minmax(420px,1.2fr)] lg:items-center">
        {/* Left column with feature list and descriptions */}
        <div>
          <p className="mb-4 text-subtitle text-white">KEY FEATURES</p>
          <div className="flex flex-col gap-5">
            {features.map((feature) => {
              const isExpanded = expandedFeature === feature.title;

              return (
                // feature list (buttons and descriptions) is rendered in a 2-column grid, with the description spanning both columns when expanded
                <div key={feature.title} className="grid grid-cols-[1fr_48px] gap-3">
                  
                  {/* feature title button */}
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
                  
                  {/* plus/minus button */}
                  <button
                    type="button"
                    className="flex items-center justify-center border border-red-700 bg-black-500 p-4 text-white transition-colors hover:bg-red-950/40"
                    onClick={() => setExpandedFeature(isExpanded ? null : feature.title)}
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} ${feature.title}`}
                  >
                    {isExpanded ? <Minus className="size-5" /> : <Plus className="size-5" />}
                  </button>
                
                  {isExpanded ? (
                    // feature description, only rendered when the feature is expanded
                    <div
                      id={`${feature.title.replaceAll(" ", "-").toLowerCase()}-panel`}
                      className="col-1 border border-b border-red-700 bg-[linear-gradient(180deg,rgba(214,28,28,0.2),rgba(0,0,0,0.95)_56%)] px-4 pb-5 pt-3 text-b1 leading-6 text-white"
                    >
                      {feature.body}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column with the 3D model viewer */}
        <ModelViewer model={activeModel} />
      </div>
    </section>
  );
}