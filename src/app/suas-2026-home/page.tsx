import { ScrollHero } from "./ScrollHero";
import { KeyFeatures } from "./KeyFeatures";
import { Video } from "./Video";

export default function SUAS2026HomePage() {
  return (
    <div className="bg-black-500">
      <ScrollHero />
      <Video />
      <KeyFeatures />
    </div>
  );
}
