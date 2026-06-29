"use client";

import { useEffect, useRef, type RefObject } from "react";

type WheelNavigationOptions = {
  cooldownMs: number;
  enabled?: boolean;
  onStep: (direction: number) => void;
  threshold: number;
};

// useWheelNavigation captures wheel input with a non-passive listener so page scroll stays locked.
export function useWheelNavigation(
  ref: RefObject<HTMLElement | null>,
  { cooldownMs, enabled = true, onStep, threshold }: WheelNavigationOptions,
) {
  const lastWheelAt = useRef(0);
  const onStepRef = useRef(onStep);

  // Keeps the latest step handler without rebinding the native wheel listener.
  useEffect(() => {
    onStepRef.current = onStep;
  }, [onStep]);

  // Binds a native wheel listener that can always prevent page scrolling.
  useEffect(() => {
    const element = ref.current;

    if (!element || !enabled) {
      return;
    }

    // handleWheel consumes every wheel event and throttles carousel movement.
    const handleWheel = (event: WheelEvent) => {
      const now = Date.now();

      event.preventDefault();
      event.stopPropagation();

      if (Math.abs(event.deltaY) < threshold || now - lastWheelAt.current < cooldownMs) {
        return;
      }

      lastWheelAt.current = now;
      onStepRef.current(event.deltaY > 0 ? 1 : -1);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [cooldownMs, enabled, ref, threshold]);
}
