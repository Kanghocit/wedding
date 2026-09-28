"use client";

import { useEffect, useState } from "react";
import { padCountdownUnit, splitCountdown } from "@/lib/date-utils";

export type CountdownDisplay = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  /** Raw parts for aria-live summary */
  parts: ReturnType<typeof splitCountdown>;
};

function computeDisplay(targetMs: number | null): CountdownDisplay {
  if (targetMs == null) {
    const zero = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      parts: zero,
    };
  }
  const parts = splitCountdown(targetMs - Date.now());
  return {
    days: padCountdownUnit(parts.days),
    hours: padCountdownUnit(parts.hours),
    minutes: padCountdownUnit(parts.minutes),
    seconds: padCountdownUnit(parts.seconds),
    parts,
  };
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useCountdown(targetMs: number | null): CountdownDisplay {
  const [display, setDisplay] = useState<CountdownDisplay>(() =>
    computeDisplay(targetMs),
  );

  useEffect(() => {
    const tick = () => setDisplay(computeDisplay(targetMs));

    tick();

    if (prefersReducedMotion()) {
      return;
    }

    const id = window.setInterval(tick, 1000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [targetMs]);

  return display;
}
