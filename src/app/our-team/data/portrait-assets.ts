export type PortraitImage = {
  src: string;
  position?: string;
};

export const defaultPortraitPosition = "50% 35%";

const encodeHeadshot = (filename: string) =>
  `/images/headshots/${encodeURIComponent(filename)}`;

const portrait = (
  filename: string,
  position?: string,
): PortraitImage => ({
  src: encodeHeadshot(filename),
  ...(position ? { position } : {}),
});

export const portraits = {
  ethanLiberman: portrait("Team Lead - Ethan Liberman.png"),
  jamesMorton: portrait("Chief Engineer - James Morton.png"),
  oliverBilston: portrait("COO - Oliver Bilston.png"),
  connorMadigan: portrait("Finance Manager - Connor Madigan.png"),
  aliceBarling: portrait("Workshop Manager - Alice Barling.png"),
  jamesMcIntyre: portrait("PNC - James McIntyre.png"),
  claireZhang: portrait("IT Manager - Claire Zhang.png"),
  lukeNicholson: portrait("Safety Officer - Luke Nicholson.png"),
  lochlanChallis: portrait("Aero - Lochlan Challis.png"),
  cheeYong: portrait("Aero - Chee Yong.png"),
  yogitaAnand: portrait("Avionics- Yogita Anand.png"),
  izaakEstandarte: portrait("Avionics - Izaak Estandarte.png"),
  sumiBandara: portrait("Ops - Sumi Bandara.png"),
  oliverBassily: portrait("Props - Oliver Bassily.png"),
  julianNosiara: portrait("Props - Julian Nosiara.png"),
  alexiRampono: portrait("Flops - Alexi Rampono.png"),
  alastairMclennan: portrait("Flops - Alastair Mclennan.png"),
  adwikGhosh: portrait("Lead Pilot - Adwik Ghosh.png"),
  tomMachin: portrait("Lead Pilot - Tom Machin.png"),
} as const satisfies Record<string, PortraitImage>;
