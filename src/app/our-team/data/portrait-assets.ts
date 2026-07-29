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
  ethanLiberman: portrait("Team Lead - Ethan Liberman.webp"),
  jamesMorton: portrait("Chief Engineer - James Morton.webp"),
  oliverBilston: portrait("COO - Oliver Bilston.webp"),
  connorMadigan: portrait("Finance Manager - Connor Madigan.webp"),
  aliceBarling: portrait("Workshop Manager - Alice Barling.webp"),
  jamesMcIntyre: portrait("PNC - James McIntyre.webp"),
  claireZhang: portrait("IT Manager - Claire Zhang.webp"),
  lukeNicholson: portrait("Safety Officer - Luke Nicholson.webp"),
  lochlanChallis: portrait("Aero - Lochlan Challis.webp"),
  cheeYong: portrait("Aero - Chee Yong.webp"),
  georgeVasilidis: portrait("Aero - George Vasilidis.webp", "50% 32%"),
  sotaKawasaki: portrait("Aero - Sota Kawasaki.webp", "50% 31%"),
  yogitaAnand: portrait("Avionics- Yogita Anand.webp"),
  izaakEstandarte: portrait("Avionics - Izaak Estandarte.webp"),
  folgerKong: portrait("Avionics - Folger Kong.webp", "50% 30%"),
  sumiBandara: portrait("Ops - Sumi Bandara.webp"),
  prajyothRaireddy: portrait("Ops - Prajyoth Raireddy.webp", "50% 31%"),
  oliverBassily: portrait("Props - Oliver Bassily.webp"),
  julianNosiara: portrait("Props - Julian Nosiara.webp"),
  ashvinCali: portrait("Props - Ashvin Cali.webp", "50% 31%"),
  lyndonBulman: portrait("Props - Lyndon Bulman.webp", "50% 30%"),
  alexiRampono: portrait("Flops - Alexi Rampono.webp"),
  alastairMclennan: portrait("Flops - Alastair Mclennan.webp"),
  adwikGhosh: portrait("Lead Pilot - Adwik Ghosh.webp"),
  tomMachin: portrait("Lead Pilot - Tom Machin.webp"),
} as const satisfies Record<string, PortraitImage>;
