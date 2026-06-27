// Shared layout classes keep the closed navbar and overlay header aligned.
export const topRowClass =
  "mx-auto grid h-20 w-full max-w-[1720px] grid-cols-[84px_minmax(0,1fr)_84px] items-center px-5 sm:grid-cols-[132px_minmax(0,1fr)_132px] sm:px-8 lg:px-12";

export const navButtonClass =
  "flex h-10 w-[84px] items-center justify-center rounded-full bg-white/[0.055] text-[0.65rem] uppercase tracking-[0.14em] text-white/88 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 sm:h-11 sm:w-[132px] sm:text-b2 sm:tracking-[0.18em] motion-reduce:transition-none";

export const headingClass =
  "text-[clamp(3rem,13vw,5.35rem)] font-medium leading-[0.96] tracking-[-0.05em]";

// Menu and search share this wrapper so their first interactive elements start
// on the same horizontal and vertical grid line.
export const overlayContentClass =
  "mx-auto flex w-full max-w-[1720px] flex-1 items-start px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-12 lg:py-20";

export const overlayInnerClass = "w-full max-w-[980px]";
