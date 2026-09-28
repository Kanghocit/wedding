"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { CoverFallingPetals } from "@/components/invitation/CoverFallingPetals";
import { formatDisplayDate } from "@/lib/date-utils";
import { colors, type } from "@/lib/theme";

type Props = {
  groomShort: string;
  brideShort: string;
  weddingDate: string;
  onOpenStart: () => void;
  onDismiss: () => void;
};

export function EnvelopeCover({
  groomShort,
  brideShort,
  weddingDate,
  onOpenStart,
  onDismiss,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const floralsRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const root = rootRef.current;
    const card = cardRef.current;
    const florals = floralsRef.current;
    if (!root || reduced) return;

    const ovals = root.querySelectorAll("[data-cover-oval]");

    if (card) {
      gsap.set(card, { opacity: 0, scale: 0.94, y: 20 });
      gsap.to(card, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.75,
        ease: "power2.out",
      });
    }

    if (florals) {
      gsap.from(florals.children, {
        opacity: 0.35,
        scale: 0.85,
        duration: 0.85,
        stagger: 0.1,
        delay: 0.2,
        ease: "power2.out",
      });
    }

    ovals.forEach((el, i) => {
      gsap.to(el, {
        opacity: 0.12,
        duration: 4 + i,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => {
      gsap.killTweensOf([card, florals, ...ovals].filter(Boolean));
    };
  }, []);

  const handleOpen = () => {
    if (openingRef.current) return;
    openingRef.current = true;
    onOpenStart();

    const root = rootRef.current;
    const card = cardRef.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!root || !card || reduced) {
      onDismiss();
      return;
    }

    const tl = gsap.timeline({ onComplete: () => onDismiss() });
    tl.to(card, {
      scale: 0.96,
      opacity: 0,
      y: -10,
      duration: 0.5,
      ease: "power2.inOut",
    }).to(root, { opacity: 0, duration: 0.35, ease: "power2.in" }, "-=0.18");
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4"
      style={{ backgroundColor: colors.olive }}
    >
      <div
        data-cover-oval
        className="pointer-events-none absolute -left-[10%] top-[20%] h-40 w-72 rounded-[50%] bg-white/[0.04] blur-2xl"
        aria-hidden
      />
      <div
        data-cover-oval
        className="pointer-events-none absolute -right-[5%] bottom-[18%] h-36 w-64 rounded-[50%] bg-white/[0.05] blur-2xl"
        aria-hidden
      />

      <CoverFallingPetals />

      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-[min(100%,20.5rem)] md:max-w-[22rem] rounded-2xl bg-[#FFFAF7] px-7 pt-9 pb-8 md:px-9 md:pt-10 md:pb-9 shadow-[0_18px_48px_rgba(0,0,0,0.22)] text-center text-[#404A1D] overflow-visible"
      >
        <div
          ref={floralsRef}
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-2xl"
          aria-hidden
        >
          <div className="absolute -left-3 -top-2 h-[11rem] w-[11rem] md:h-[12rem] md:w-[12rem] opacity-100 saturate-[1.12] contrast-[1.08]">
            <Image
              src="/themes/hoa.webp"
              alt=""
              fill
              className="object-contain object-left-top drop-shadow-[0_2px_8px_rgba(64,74,29,0.12)]"
              sizes="192px"
              priority
            />
          </div>
          <div className="absolute -right-3 -bottom-3 h-[12rem] w-[12rem] md:h-[13rem] md:w-[13rem] scale-x-[-1] opacity-100 saturate-[1.12] contrast-[1.08]">
            <Image
              src="/themes/hoa.webp"
              alt=""
              fill
              className="object-contain object-right-bottom drop-shadow-[0_2px_8px_rgba(64,74,29,0.12)]"
              sizes="208px"
              priority
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#404A1D] text-[11px] text-white">
            ♥
          </div>

          <h1 className={type.cover.name}>
            <span className="block">{groomShort}</span>
            <span className={`my-0.5 block ${type.cover.amp}`}>&</span>
            <span className="block">{brideShort}</span>
          </h1>

          <div
            className="my-4 flex w-[min(100%,10rem)] items-center gap-2 opacity-35"
            aria-hidden
          >
            <span className="h-px flex-1 bg-[#404A1D]" />
            <span className="text-[8px] leading-none">♦</span>
            <span className="h-px flex-1 bg-[#404A1D]" />
          </div>

          <p className={type.cover.date}>{formatDisplayDate(weddingDate)}</p>

          <p className={`mt-5 ${type.cover.invite}`}>Thân Mời</p>

          <button
            type="button"
            onClick={handleOpen}
            className={`mt-7 rounded-full bg-[#404A1D] px-11 py-2.5 text-white shadow-[0_6px_20px_rgba(64,74,29,0.35)] hover:brightness-105 active:scale-[0.98] transition-[transform,filter] ${type.cover.button}`}
          >
            Mở thiệp
          </button>
        </div>
      </div>
    </div>
  );
}
