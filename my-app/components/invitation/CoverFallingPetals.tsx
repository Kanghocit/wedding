"use client";

import { useEffect, useState } from "react";

const PETAL_COUNT = 18;
const STATIC_PETAL_COUNT = 8;

function buildAnimatedPetals() {
  return Array.from({ length: PETAL_COUNT }, (_, i) => ({
    id: i,
    left: `${5 + ((i * 6.2) % 88)}%`,
    fontSize: 10 + (i % 7),
    duration: 9 + (i % 7),
    delay: -(i * 0.65),
    opacity: 0.45 + (i % 4) * 0.05,
  }));
}

function buildStaticPetals() {
  return Array.from({ length: STATIC_PETAL_COUNT }, (_, i) => ({
    id: i,
    left: `${8 + i * 11}%`,
    top: `${12 + (i % 4) * 18}%`,
    fontSize: 11 + (i % 3),
    opacity: 0.5,
  }));
}

export function CoverFallingPetals() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  if (reduced) {
    return (
      <div
        className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
        aria-hidden
      >
        {buildStaticPetals().map((p) => (
          <span
            key={p.id}
            className="absolute select-none text-pink-200/60"
            style={{
              left: p.left,
              top: p.top,
              fontSize: p.fontSize,
              opacity: p.opacity,
            }}
          >
            🌸
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
      aria-hidden
    >
      {buildAnimatedPetals().map((p) => (
        <span
          key={p.id}
          className="petal absolute select-none text-pink-200/70"
          style={{
            left: p.left,
            top: "-5vh",
            fontSize: p.fontSize,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          🌸
        </span>
      ))}
    </div>
  );
}
