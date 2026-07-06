import { DroneCarousel } from "./drone-carousel";
import { drones } from "./drone-data";

// OurDronesPage renders the interactive fleet carousel.
export default function OurDronesPage() {
  return <DroneCarousel drones={drones} />;
}
