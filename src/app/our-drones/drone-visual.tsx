import type { Drone } from "./drone-data";
import Image from "next/image";

type DroneVisualProps = {
  drone: Pick<Drone, "name" | "heroImage">;
  className?: string;
};

// DroneVisual renders a real drone image when available, otherwise a branded placeholder. 
export function DroneVisual({ drone, className = "" }: DroneVisualProps) {
  if (drone.heroImage) {
    return (
      <div className={`relative h-full w-full ${className}`}>
        <Image
          alt={`${drone.name} drone`}
          src={drone.heroImage}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain drop-shadow-2xl"
          draggable={false}
          priority
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
