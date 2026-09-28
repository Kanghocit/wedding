"use client";

import { useEffect, useRef } from "react";

const SCROLL_SPEED_PX_PER_SEC = 32;
const BOTTOM_THRESHOLD_PX = 24;
const SCROLL_TO_TOP_MS = 850;
const DELAY_AFTER_TOP_MS = 450;

type Options = {
  enabled: boolean;
  paused: boolean;
};

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function smoothScrollToTop(durationMs: number): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const startY = window.scrollY;
  if (startY <= 0) return Promise.resolve();

  return new Promise((resolve) => {
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      window.scrollTo(0, startY * (1 - easeOutCubic(t)));
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };

    requestAnimationFrame(step);
  });
}

export function useIdleAutoScroll({ enabled, paused }: Options) {
  const stoppedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeListenersRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    stoppedRef.current = false;
  }, [enabled]);

  useEffect(() => {
    if (!enabled || paused) {
      removeListenersRef.current?.();
      removeListenersRef.current = null;
      if (startTimerRef.current != null) {
        clearTimeout(startTimerRef.current);
        startTimerRef.current = null;
      }
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;

    const stop = () => {
      stoppedRef.current = true;
      removeListenersRef.current?.();
      removeListenersRef.current = null;
      if (startTimerRef.current != null) {
        clearTimeout(startTimerRef.current);
        startTimerRef.current = null;
      }
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
    };

    const tick = (now: number) => {
      if (stoppedRef.current || cancelled) return;

      const last = lastTimeRef.current ?? now;
      lastTimeRef.current = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (window.scrollY >= maxScroll - BOTTOM_THRESHOLD_PX) {
        stop();
        return;
      }

      window.scrollBy(0, SCROLL_SPEED_PX_PER_SEC * dt);
      rafRef.current = requestAnimationFrame(tick);
    };

    const beginAutoScroll = () => {
      if (cancelled || stoppedRef.current) return;

      const onUserIntent = () => stop();
      window.addEventListener("wheel", onUserIntent, { passive: true });
      window.addEventListener("touchstart", onUserIntent, { passive: true });
      window.addEventListener("keydown", onUserIntent);
      removeListenersRef.current = () => {
        window.removeEventListener("wheel", onUserIntent);
        window.removeEventListener("touchstart", onUserIntent);
        window.removeEventListener("keydown", onUserIntent);
      };

      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    };

    const run = async () => {
      if (reduced) {
        window.scrollTo(0, 0);
        startTimerRef.current = setTimeout(beginAutoScroll, DELAY_AFTER_TOP_MS);
        return;
      }

      await smoothScrollToTop(SCROLL_TO_TOP_MS);
      if (cancelled) return;

      startTimerRef.current = setTimeout(() => {
        startTimerRef.current = null;
        beginAutoScroll();
      }, DELAY_AFTER_TOP_MS);
    };

    void run();

    return () => {
      cancelled = true;
      stop();
    };
  }, [enabled, paused]);
}
