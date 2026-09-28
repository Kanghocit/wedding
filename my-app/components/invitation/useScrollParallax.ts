"use client";

import { useEffect, useState, type RefObject } from "react";

export function useScrollParallax(
  containerRef: RefObject<HTMLElement | null>,
  speed = 0.15,
  scrollRootRef?: RefObject<HTMLElement | null>,
): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;
        const progress =
          1 - (rect.top + rect.height * 0.5) / (viewH + rect.height);
        setOffset(progress * 120 * speed);
      });
    };

    onScroll();
    const scrollTarget = scrollRootRef?.current ?? window;
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scrollTarget.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [containerRef, scrollRootRef, speed]);

  return offset;
}
