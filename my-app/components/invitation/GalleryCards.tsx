"use client";

import { CoverFlow, type CoverFlowItem } from "@ashishgogula/coverflow";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { headingClassName, type } from "@/lib/theme";

type Props = {
  photos: string[];
  onOpenLightbox: (index: number) => void;
  /** Chỉ chạy auto-advance sau khi đã mở thiệp (mặc định true) */
  invitationOpen?: boolean;
};

const ITEM_WIDTH = 240;
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 4) / 3);
const DEFAULT_INITIAL_INDEX = 4;
const AUTO_ADVANCE_MS = 4000;
const AUTO_PAUSE_AFTER_INTERACTION_MS = 12000;

function clampInitialIndex(length: number): number {
  if (length <= 0) return 0;
  return Math.min(DEFAULT_INITIAL_INDEX, length - 1);
}

export function GalleryCards({
  photos,
  onOpenLightbox,
  invitationOpen = true,
}: Props) {
  const [selected, setSelected] = useState(() =>
    clampInitialIndex(photos.length),
  );
  const autoAdvancingRef = useRef(false);
  const pauseUntilRef = useRef(0);

  useEffect(() => {
    setSelected(clampInitialIndex(photos.length));
  }, [photos.length]);

  const items: CoverFlowItem[] = useMemo(
    () =>
      photos.map((url, i) => ({
        id: i,
        image: url,
        title: `Ảnh ${i + 1}`,
      })),
    [photos],
  );

  const progress =
    photos.length <= 1 ? 1 : selected / (photos.length - 1);

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

  const handleIndexChange = useCallback((index: number) => {
    setSelected(index);
    if (!autoAdvancingRef.current) {
      bumpInteractionPause();
    }
    autoAdvancingRef.current = false;
  }, [bumpInteractionPause]);

  const handleItemClick = useCallback(
    (_: CoverFlowItem, index: number) => {
      bumpInteractionPause();
      onOpenLightbox(index);
    },
    [bumpInteractionPause, onOpenLightbox],
  );

  useEffect(() => {
    if (!invitationOpen || photos.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      autoAdvancingRef.current = true;
      setSelected((i) => (i + 1) % photos.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(id);
  }, [photos.length, invitationOpen]);

  if (!photos.length) return null;

  return (
    <div className="relative w-full">
      <h2 className={`${headingClassName()} mb-6 md:mb-8`}>ALBUM ẢNH</h2>
      <div className="relative mx-auto w-full">
        <button
          type="button"
          aria-label="Previous photo"
          className="hidden md:flex absolute left-2 md:left-4 top-[42%] -translate-y-1/2 z-[20] w-8 h-8 items-center justify-center rounded-full bg-white shadow-md border border-black/5 text-[#404A1D] text-lg hover:scale-105 transition-transform"
          onClick={goPrev}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next photo"
          className="absolute right-2 md:right-4 top-[42%] -translate-y-1/2 z-[20] w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md border border-black/5 text-[#404A1D] text-lg hover:scale-105 transition-transform"
          onClick={goNext}
        >
          ›
        </button>

        <div
          className="h-[min(52vw,320px)] md:h-[380px] w-full px-1"
          onPointerDown={bumpInteractionPause}
        >
          <CoverFlow
            key={photos.join("|")}
            items={items}
            initialIndex={selected}
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
            stackSpacing={72}
            centerGap={180}
            rotation={42}
            enableReflection={false}
            enableClickToSnap
            enableScroll
            enableAudio={false}
            className="rounded-none [&_h3]:hidden [&_div.absolute.bottom-8]:hidden"
            onIndexChange={handleIndexChange}
            onItemClick={handleItemClick}
            renderImage={({
              src,
              alt,
              width,
              height,
              className,
              draggable,
              sizes,
              priority,
              loading,
            }) => (
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`${className} rounded-[1.25rem] object-cover shadow-[0_8px_24px_rgba(64,74,29,0.12)]`}
                draggable={draggable}
                sizes={sizes}
                priority={priority}
                loading={loading}
              />
            )}
          />
        </div>

        <div className="mx-auto mt-2 max-w-[min(100%,20rem)] md:max-w-xs px-8">
          <div className="h-1 w-full rounded-full bg-[#404A1D12] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#404A1D55] transition-[width] duration-150 ease-out"
              style={{
                width: `${Math.max(8, progress * 100)}%`,
              }}
            />
          </div>
          <p className={`text-center mt-2.5 ${type.galleryCounter}`}>
            {selected + 1} / {photos.length}
          </p>
        </div>
      </div>
    </div>
  );
}
