"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { LayoutMetrics } from "@/components/invitation/galleryStack";

import "swiper/css";
import "swiper/css/effect-coverflow";

type Props = {
  photos: string[];
  selected: number;
  layout: LayoutMetrics;
  initialIndex: number;
  onIndexChange: (index: number) => void;
  onOpenLightbox: (index: number) => void;
  onInteraction: () => void;
};

export function GallerySwiperStage({
  photos,
  selected,
  layout,
  initialIndex,
  onIndexChange,
  onOpenLightbox,
  onInteraction,
}: Props) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const skipSyncRef = useRef(false);

  const loop = photos.length > 1;

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;
    const current = loop ? swiper.realIndex : swiper.activeIndex;
    if (current === selected) return;
    skipSyncRef.current = true;
    if (loop) swiper.slideToLoop(selected, 1050);
    else swiper.slideTo(selected, 1050);
  }, [selected, loop]);

  return (
    <Swiper
      className="gallery-swiper h-full w-full"
      modules={[EffectCoverflow]}
      effect="coverflow"
      grabCursor
      centeredSlides
      loop={loop}
      slidesPerView="auto"
      speed={1050}
      initialSlide={initialIndex}
      coverflowEffect={{
        rotate: 38,
        stretch: -8,
        depth: 140,
        modifier: 1.05,
        slideShadows: false,
      }}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      onTouchStart={onInteraction}
      onSlideChange={(swiper) => {
        if (skipSyncRef.current) {
          skipSyncRef.current = false;
          return;
        }
        onIndexChange(loop ? swiper.realIndex : swiper.activeIndex);
      }}
      onTransitionEnd={(swiper) => {
        skipSyncRef.current = false;
        onIndexChange(loop ? swiper.realIndex : swiper.activeIndex);
      }}
    >
      {photos.map((url, i) => (
        <SwiperSlide
          key={`${url}-${i}`}
          className="gallery-swiper-slide"
          style={{ width: layout.slideW, height: layout.stageH }}
        >
          <button
            type="button"
            aria-label={
              i === selected ? `Ảnh ${i + 1}, mở xem` : `Chuyển tới ảnh ${i + 1}`
            }
            className="relative block h-full w-full overflow-hidden rounded-[1.4rem] bg-[#404A1D]/8 shadow-[0_12px_36px_rgba(64,74,29,0.18)] ring-1 ring-[#404A1D]/10 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#404A1D]/40 [-webkit-tap-highlight-color:transparent] data-[active=true]:shadow-[0_16px_44px_rgba(64,74,29,0.22)]"
            data-active={i === selected ? "true" : "false"}
            onClick={() => {
              onInteraction();
              const swiper = swiperRef.current;
              if (!swiper) return;
              const current = loop ? swiper.realIndex : swiper.activeIndex;
              if (current === i) onOpenLightbox(i);
              else if (loop) swiper.slideToLoop(i);
              else swiper.slideTo(i);
            }}
          >
            <Image
              src={url}
              alt={`Ảnh ${i + 1}`}
              fill
              className="object-cover object-[center_18%]"
              sizes="(max-width: 768px) 68vw, 340px"
              priority={Math.abs(i - selected) <= 1}
            />
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
