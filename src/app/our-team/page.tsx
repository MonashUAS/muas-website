import { JoinTeamCallout } from "./components/join-team-callout";
import { ManagementTeam } from "./components/management-team";
import { OurTeamHero } from "./components/our-team-hero";
import { OurTeamMission } from "./components/our-team-mission";

export default function OurTeamPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-black text-white">
      <OurTeamHero />

      <main className="relative bg-[linear-gradient(180deg,#000000_0%,#020712_46%,#001f49_100%)]">
        <OurTeamMission />
        <ManagementTeam />
        <JoinTeamCallout />
      </main>
    </div>
  );
}
