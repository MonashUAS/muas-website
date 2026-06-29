import {
  HomepageExplorePanels,
  HomepageHero,
  HomepageRedbackParallax,
  HomepageSectionsExplorer,
  HomepageSponsorCarousel,
} from "./home";

export default function Home() {
  return (
    <>
      <HomepageHero />
      <HomepageExplorePanels />
      <HomepageRedbackParallax />
      <HomepageSponsorCarousel />
      <HomepageSectionsExplorer />
    </>
  );
}
