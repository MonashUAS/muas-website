import type { Drone } from "./drone-data";
import Image from "next/image";
import { useEffect } from "react";

type DroneVisualProps = {
  drone: Pick<Drone, "name" | "heroImage">;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
};

// DroneVisual renders a real drone image when available, otherwise a branded placeholder. 
export function DroneVisual({
  drone,
  className = "",
  priority = false,
  onLoad,
}: DroneVisualProps) {
  useEffect(() => {
    if (!drone.heroImage) {
      onLoad?.();
    }
  }, [drone.heroImage, onLoad]);

  if (drone.heroImage) {
    return (
      <div className={`relative h-full w-full ${className}`}>
        <Image
          alt={`${drone.name} drone`}
          src={drone.heroImage}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
          draggable={false}
          priority={priority}
          onLoadingComplete={onLoad}
        />
      </div>
    );
  }

  return (
    <div
      aria-label={`${drone.name} image placeholder`}
      className={`flex h-full w-full items-center justify-center rounded-full border border-blue-200 bg-white/55 text-center text-b2 font-medium uppercase text-blue-700 shadow-xl ${className}`}
    >
      Image pending
    </div>
  );
}
