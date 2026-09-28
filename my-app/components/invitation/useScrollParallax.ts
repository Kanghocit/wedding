"use client";

import { useEffect, useState, type RefObject } from "react";

export function useScrollParallax(
  containerRef: RefObject<HTMLElement | null>,
  speed = 0.15,
): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = 1 - (rect.top + rect.height * 0.5) / (viewH + rect.height);
      setOffset(progress * 120 * speed);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [containerRef, speed]);

  return offset;
}
