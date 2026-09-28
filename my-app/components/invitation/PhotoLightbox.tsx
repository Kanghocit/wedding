"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  photos: string[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
};

export function PhotoLightbox({
  photos,
  index,
  onIndexChange,
  onClose,
}: Props) {
  const [scale, setScale] = useState(1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => {
    onIndexChange((index - 1 + photos.length) % photos.length);
    setScale(1);
  }, [index, onIndexChange, photos.length]);

  const next = useCallback(() => {
    onIndexChange((index + 1) % photos.length);
    setScale(1);
  }, [index, onIndexChange, photos.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, next, prev]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setScale((s) => Math.min(3, Math.max(1, s - e.deltaY * 0.002)));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-black/92 flex flex-col items-center justify-center px-2 sm:px-4 pt-10 sm:pt-12 pb-4 sm:pb-6">
      <button
        type="button"
        aria-label="Close lightbox"
        className="absolute right-2 sm:right-4 top-2 sm:top-4 z-10 text-white text-xl sm:text-2xl w-10 h-10 rounded-full hover:bg-white/20"
        onClick={onClose}
      >
        ✕
      </button>
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
        {index + 1} / {photos.length}
      </div>
      <div
        ref={wrapRef}
        className="relative flex flex-1 w-full max-w-5xl items-center justify-center min-h-0 px-8 sm:px-12 touch-none"
      >
        <button
          type="button"
          aria-label="Previous image"
          className="absolute left-0 sm:left-2 z-10 text-white text-3xl sm:text-4xl hover:bg-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12"
          onClick={prev}
        >
          ‹
        </button>
        <div
          className="relative w-full h-[min(70vh,720px)] max-w-3xl transition-transform duration-200 ease-out"
          style={{ transform: `scale(${scale})` }}
        >
          <Image
            src={photos[index]}
            alt=""
            fill
            className="object-contain rounded-xl sm:rounded-2xl shadow-2xl select-none"
            sizes="100vw"
            draggable={false}
          />
        </div>
        <button
          type="button"
          aria-label="Next image"
          className="absolute right-0 sm:right-2 z-10 text-white text-3xl sm:text-4xl hover:bg-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12"
          onClick={next}
        >
          ›
        </button>
      </div>
      <div className="flex-shrink-0 flex gap-2 sm:gap-3 overflow-x-auto px-2 py-2 mt-3 bg-black/30 rounded-lg backdrop-blur-sm max-w-[90vw] scrollbar-thin">
        {photos.map((url, i) => (
          <button
            key={url}
            type="button"
            aria-label={`View image ${i + 1}`}
            onClick={() => {
              onIndexChange(i);
              setScale(1);
            }}
            className={`relative shrink-0 h-12 w-12 sm:h-16 sm:w-16 rounded-md sm:rounded-lg overflow-hidden transition-all ${i === index ? "scale-105 shadow-lg outline outline-2 outline-[#404A1D] outline-offset-2" : "opacity-60 hover:opacity-100"}`}
          >
            <Image src={url} alt="" fill className="object-cover" sizes="64px" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  );
}
