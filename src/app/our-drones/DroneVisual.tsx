import type { Drone } from "./drone-data";

type DroneVisualProps = {
  drone: Pick<Drone, "name" | "heroImage">;
  className?: string;
};

// DroneVisual renders a real drone image when available, otherwise a branded placeholder.
export function DroneVisual({ drone, className = "" }: DroneVisualProps) {
  if (drone.heroImage) {
    return (
      <img
        alt={`${drone.name} drone`}
        className={`h-full w-full object-contain drop-shadow-2xl ${className}`}
        draggable={false}
        src={drone.heroImage}
      />
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
