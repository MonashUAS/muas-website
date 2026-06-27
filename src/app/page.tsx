import { HomepageExplorePanels } from "./HomepageExplorePanels";
import { HomepageHero } from "./HomepageHero";
import { HomepageSponsorCarousel } from "./HomepageSponsorCarousel";

export default function Home() {
  return (
    <>
      <HomepageHero />
      <HomepageExplorePanels />
      <HomepageSponsorCarousel />
    </>
  );
}
