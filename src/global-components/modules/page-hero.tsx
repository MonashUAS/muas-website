import Image from "next/image";

type PageHeroProps = {
  src: string;
  alt: string;
  heading: string;
  objectPositionClassName: string;
  overlayClassName?: string;
};

export function PageHero({
  src,
  alt,
  heading,
  objectPositionClassName,
  overlayClassName = "bg-blue-900/45",
}: PageHeroProps) {
  return (
    <section className="relative flex h-52 shrink-0 items-center justify-center overflow-hidden sm:h-64 lg:h-72 xl:h-80">
      <Image
        src={src}
        alt={alt}
        fill
        preload
        fetchPriority="high"
        sizes="calc(100vw - 68px)"
        className={`object-cover ${objectPositionClassName}`}
      />

      <div className={`absolute inset-0 ${overlayClassName}`} />

      <h1 className="relative max-w-full break-words px-4 text-center text-h7 font-bold leading-tight tracking-[-0.05em] text-white sm:px-6 sm:text-h3 lg:text-h2">
        {heading}
      </h1>
    </section>
  );
}
