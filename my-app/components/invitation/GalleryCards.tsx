"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AUTO_ADVANCE_MS,
  AUTO_PAUSE_AFTER_INTERACTION_MS,
  clampInitialIndex,
  measureLayout,
  type LayoutMetrics,
} from "@/components/invitation/galleryStack";
import { headingClassName, type } from "@/lib/theme";

const GallerySwiperStage = dynamic(
  () =>
    import("@/components/invitation/GallerySwiperStage").then(
      (m) => m.GallerySwiperStage,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="mx-auto w-full animate-pulse rounded-[1.4rem] bg-[#404A1D]/10"
        style={{ height: 546 }}
      />
    ),
  },
);

type Props = {
  photos: string[];
  onOpenLightbox: (index: number) => void;
  invitationOpen?: boolean;
};

function NavButton({
  direction,
  onClick,
  className,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous photo" : "Next photo"}
      onClick={onClick}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#404A1D]/14 bg-white/95 text-[#404A1D] shadow-[0_4px_16px_rgba(64,74,29,0.14)] transition-[transform,background-color] hover:scale-105 hover:bg-[#404A1D] hover:text-white active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#404A1D]/35 [-webkit-tap-highlight-color:transparent] ${className ?? ""}`}
    >
      <span className="text-xl leading-none font-light pb-px select-none">
        {direction === "prev" ? "‹" : "›"}
      </span>
    </button>
  );
}

export function GalleryCards({
  photos,
  onOpenLightbox,
  invitationOpen = true,
}: Props) {
  const initialIndex = clampInitialIndex(photos.length);
  const [selected, setSelected] = useState(initialIndex);
  const pauseUntilRef = useRef(0);
  const [layout, setLayout] = useState<LayoutMetrics>(() => measureLayout());
  const [swiperEpoch, setSwiperEpoch] = useState(0);

  useEffect(() => {
    const apply = () => setLayout(measureLayout());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  useEffect(() => {
    const next = clampInitialIndex(photos.length);
    setSelected(next);
    setSwiperEpoch((n) => n + 1);
  }, [photos.length]);

  const bumpInteractionPause = useCallback(() => {
    pauseUntilRef.current = Date.now() + AUTO_PAUSE_AFTER_INTERACTION_MS;
  }, []);

  const goPrev = useCallback(() => {
    bumpInteractionPause();
    setSelected((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length, bumpInteractionPause]);

  const goNext = useCallback(() => {
    bumpInteractionPause();
    setSelected((i) => (i + 1) % photos.length);
  }, [photos.length, bumpInteractionPause]);

  useEffect(() => {
    if (!invitationOpen || photos.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      setSelected((i) => (i + 1) % photos.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(id);
  }, [photos.length, invitationOpen]);

  if (!photos.length) return null;

  return (
    <div className="relative w-full">
      <h2 className={`${headingClassName()} mb-5 md:mb-7`}>ALBUM ẢNH</h2>

      <div className="relative mx-auto w-full max-w-[min(100%,540px)] md:max-w-[820px] px-1">
        <div
          className="relative w-full overflow-visible touch-pan-y"
          style={{ height: layout.stageH }}
          onPointerDown={bumpInteractionPause}
        >
          <NavButton
            direction="prev"
            onClick={goPrev}
            className="absolute left-0 top-1/2 z-50 -translate-y-1/2"
          />
          <NavButton
            direction="next"
            onClick={goNext}
            className="absolute right-0 top-1/2 z-50 -translate-y-1/2"
          />

          <div
            className="absolute inset-0 px-11 sm:px-12"
            style={{ height: layout.stageH }}
          >
            <GallerySwiperStage
              key={swiperEpoch}
              photos={photos}
              selected={selected}
              layout={layout}
              initialIndex={initialIndex}
              onIndexChange={(index) => {
                bumpInteractionPause();
                setSelected(index);
              }}
              onOpenLightbox={(i) => {
                bumpInteractionPause();
                onOpenLightbox(i);
              }}
              onInteraction={bumpInteractionPause}
            />
          </div>
        </div>

        <p className={`text-center mt-4 ${type.galleryCounter}`}>
          {selected + 1} / {photos.length}
        </p>
      </div>
    </div>
  );
}
