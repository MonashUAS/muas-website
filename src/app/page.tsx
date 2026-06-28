import {
  HomepageExplorePanels,
  HomepageHero,
  HomepageNextSteps,
  HomepageRedbackParallax,
  HomepageSponsorCarousel,
} from "@/features/home";

export default function Home() {
  return (
    <>
      <HomepageHero />
      <HomepageExplorePanels />
      <HomepageRedbackParallax />
      <HomepageSponsorCarousel />
      <HomepageNextSteps />
    </>
  );
}
