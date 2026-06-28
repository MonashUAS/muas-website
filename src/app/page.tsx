import {
  HomepageExplorePanels,
  HomepageHero,
  HomepageRedbackParallax,
  HomepageSponsorCarousel,
} from "./home";

export default function Home() {
  return (
    <>
      <HomepageHero />
      <HomepageExplorePanels />
      <HomepageRedbackParallax />
      <HomepageSponsorCarousel />
    </>
  );
}
