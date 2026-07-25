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
  ethanLiberman: portrait("Team Lead - Ethan Liberman.jpg"),
  jamesMorton: portrait("Chief Engineer - James Morton.jpg"),
  oliverBilston: portrait("COO - Oliver Bilston.jpg"),
  connorMadigan: portrait("Finance Manager - Connor Madigan.jpg"),
  aliceBarling: portrait("Workshop Manager - Alice Barling.jpg"),
  jamesMcIntyre: portrait("PNC - James McIntyre.jpg"),
  claireZhang: portrait("IT Manager - Claire Zhang.jpg"),
  lukeNicholson: portrait("Safety Officer - Luke Nicholson.jpg"),
  lochlanChallis: portrait("Aero - Lochlan Challis.jpg"),
  cheeYong: portrait("Aero - Chee Yong.jpg"),
  yogitaAnand: portrait("Avionics- Yogita Anand.jpg"),
  izaakEstandarte: portrait("Avionics - Izaak Estandarte.jpg"),
  sumiBandara: portrait("Ops - Sumi Bandara.jpg"),
  oliverBassily: portrait("Props - Oliver Bassily.jpg"),
  julianNosiara: portrait("Props - Julian Nosiara.jpg"),
  alexiRampono: portrait("Flops - Alexi Rampono.jpg"),
  alastairMclennan: portrait("Flops - Alastair Mclennan.jpg"),
  adwikGhosh: portrait("Lead Pilot - Adwik Ghosh.jpg"),
  tomMachin: portrait("Lead Pilot - Tom Machin.jpg"),
} as const satisfies Record<string, PortraitImage>;
