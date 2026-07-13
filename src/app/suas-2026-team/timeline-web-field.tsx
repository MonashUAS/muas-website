import Image from "next/image";

type TimelineWebImages = {
  spire: string;
  bridge: string;
  shelf: string;
  lattice: string;
};

type TimelineWebFieldProps = {
  images: TimelineWebImages;
};

const webImageDimensions = {
  spire: { width: 1003, height: 1568 },
  bridge: { width: 1536, height: 1024 },
  shelf: { width: 1672, height: 941 },
  lattice: { width: 793, height: 1983 },
} as const;

const webLayers = [
  {
    image: "spire",
    className: "-top-20 left-[-6%] h-[980px] w-[980px] -rotate-[4deg]",
    imageClassName: "opacity-[0.68]",
    sizes: "980px",
  },
  {
    image: "bridge",
    className: "right-[-12%] top-[20rem] h-[760px] w-[1220px] rotate-[8deg]",
    imageClassName: "opacity-[0.46]",
    sizes: "1220px",
  },
  {
    image: "shelf",
    className: "left-[-18%] top-[48rem] h-[760px] w-[1320px] -rotate-[9deg]",
    imageClassName: "opacity-[0.42]",
    sizes: "1320px",
  },
  {
    image: "bridge",
    className: "left-[22%] top-[62rem] h-[620px] w-[980px] rotate-[18deg]",
    imageClassName: "opacity-[0.3]",
    sizes: "980px",
  },
  {
    image: "spire",
    className: "left-[52%] top-[76rem] h-[1180px] w-[820px] -translate-x-1/2 rotate-180",
    imageClassName: "opacity-[0.44]",
    sizes: "820px",
  },
  {
    image: "lattice",
    className: "right-[-10%] top-[112rem] h-[1800px] w-[760px] rotate-[8deg]",
    imageClassName: "opacity-[0.4]",
    sizes: "760px",
  },
  {
    image: "spire",
    className: "left-[-4%] top-[126rem] h-[980px] w-[700px] rotate-[8deg]",
    imageClassName: "opacity-[0.3]",
    sizes: "700px",
  },
  {
    image: "bridge",
    className: "left-[-12%] top-[150rem] h-[780px] w-[1280px] -rotate-[6deg]",
    imageClassName: "opacity-[0.4]",
    sizes: "1280px",
  },
  {
    image: "shelf",
    className: "left-[18%] top-[176rem] h-[640px] w-[1140px] rotate-[13deg]",
    imageClassName: "opacity-[0.3]",
    sizes: "1140px",
  },
  {
    image: "shelf",
    className: "right-[-18%] top-[190rem] h-[760px] w-[1320px] rotate-[7deg]",
    imageClassName: "opacity-[0.38]",
    sizes: "1320px",
  },
  {
    image: "spire",
    className: "left-[22%] top-[220rem] h-[1200px] w-[840px] -translate-x-1/2 rotate-[16deg]",
    imageClassName: "opacity-[0.36]",
    sizes: "840px",
  },
  {
    image: "lattice",
    className: "right-[20%] top-[235rem] h-[1400px] w-[620px] rotate-[4deg]",
    imageClassName: "opacity-[0.28]",
    sizes: "620px",
  },
  {
    image: "bridge",
    className: "right-[-10%] top-[258rem] h-[820px] w-[1340px] -rotate-[11deg]",
    imageClassName: "opacity-[0.36]",
    sizes: "1340px",
  },
  {
    image: "lattice",
    className: "left-[-10%] top-[292rem] h-[1700px] w-[700px] -rotate-[8deg]",
    imageClassName: "opacity-[0.34]",
    sizes: "700px",
  },
  {
    image: "bridge",
    className: "left-[28%] top-[318rem] h-[660px] w-[1060px] rotate-[7deg]",
    imageClassName: "opacity-[0.28]",
    sizes: "1060px",
  },
  {
    image: "shelf",
    className: "right-[-24%] top-[342rem] h-[760px] w-[1360px] rotate-[4deg]",
    imageClassName: "opacity-[0.32]",
    sizes: "1360px",
  },
  {
    image: "lattice",
    className: "right-[8%] top-[360rem] h-[1320px] w-[580px] rotate-[12deg]",
    imageClassName: "opacity-[0.26]",
    sizes: "580px",
  },
  {
    image: "spire",
    className: "left-[58%] top-[378rem] h-[1260px] w-[860px] -translate-x-1/2 -rotate-[18deg]",
    imageClassName: "opacity-[0.32]",
    sizes: "860px",
  },
  {
    image: "shelf",
    className: "left-[-12%] top-[408rem] h-[660px] w-[1180px] -rotate-[10deg]",
    imageClassName: "opacity-[0.28]",
    sizes: "1180px",
  },
  {
    image: "bridge",
    className: "right-[-16%] top-[430rem] h-[720px] w-[1180px] rotate-[15deg]",
    imageClassName: "opacity-[0.26]",
    sizes: "1180px",
  },
] as const;

export function TimelineWebField({ images }: TimelineWebFieldProps) {
  return (
    <div
      aria-hidden="true"
      data-timeline-web-field=""
      className="pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-full min-h-[500rem]">
        {webLayers.map((layer, index) => {
          const dimensions = webImageDimensions[layer.image];

          return (
            <div
              key={`${layer.image}-${index}`}
              data-timeline-web-layer=""
              className={`absolute ${layer.className}`}
            >
              <div className="h-full w-full">
                <Image
                  src={images[layer.image]}
                  alt=""
                  width={dimensions.width}
                  height={dimensions.height}
                  unoptimized
                  sizes={layer.sizes}
                  className={`h-full w-full object-contain contrast-125 [mix-blend-mode:screen] ${layer.imageClassName}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
