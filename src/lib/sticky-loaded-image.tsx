"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

type StickyLoadedImageProps = {
  /** When true, mount and keep the image forever after first load. */
  shouldLoad: boolean;
  children: (state: {
    showImage: boolean;
    isDecoded: boolean;
    onDecoded: () => void;
  }) => ReactNode;
};

/**
 * Latches shouldLoad so carousel images are never unmounted after first near-active,
 * avoiding blank flashes on wrap-around remounts.
 */
export function StickyLoadedImage({ shouldLoad, children }: StickyLoadedImageProps) {
  const [keepLoaded, setKeepLoaded] = useState(shouldLoad);
  const [isDecoded, setIsDecoded] = useState(false);

  useEffect(() => {
    if (shouldLoad) {
      setKeepLoaded(true);
    }
  }, [shouldLoad]);

  const onDecoded = useCallback(() => {
    setIsDecoded(true);
  }, []);

  return (
    <>
      {children({
        showImage: keepLoaded,
        isDecoded,
        onDecoded,
      })}
    </>
  );
}
