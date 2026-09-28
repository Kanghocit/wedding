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
        className="relative z-10 w-full max-w-[min(100%,20.5rem)] md:max-w-[22rem] overflow-visible rounded-[1.35rem] bg-[#FFFAF7] px-7 pt-9 pb-8 text-center text-[#404A1D] shadow-[0_22px_56px_rgba(0,0,0,0.26),0_0_0_1px_rgba(64,74,29,0.07)] ring-1 ring-inset ring-white/50 md:px-9 md:pt-10 md:pb-9"
      >
        <div
          ref={floralsRef}
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl"
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
          <div className="absolute -right-2 -bottom-1 h-[9rem] w-[9rem] scale-x-[-1] opacity-95 saturate-[1.08] contrast-[1.05] [mask-image:linear-gradient(to_top,black_50%,transparent_88%)] md:h-[10rem] md:w-[10rem] [-webkit-mask-image:linear-gradient(to_top,black_50%,transparent_88%)]">
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

        <div className="relative z-20 flex w-full flex-col items-center pb-1 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:top-[42%] before:-z-10 before:rounded-b-[1.35rem] before:bg-gradient-to-b before:from-transparent before:via-[#FFFAF7]/70 before:to-[#FFFAF7]">
          <div
            className="pointer-events-none absolute left-1/2 top-[3.25rem] -z-10 h-[10.5rem] w-[min(100%,14.5rem)] -translate-x-1/2 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,#FFFAF7_0%,rgba(255,250,247,0.88)_42%,transparent_72%)]"
            aria-hidden
          />

          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#404A1D] text-[12px] text-white shadow-[0_4px_14px_rgba(64,74,29,0.28)] ring-2 ring-[#FFFAF7]">
            ♥
          </div>

          <div className="relative w-full max-w-[15rem] px-1">
            <h1
              className={`${type.cover.name} [text-shadow:0_1px_0_rgba(255,250,247,0.98),0_2px_12px_rgba(255,250,247,0.65)]`}
            >
              <span className="block">{groomShort}</span>
              <span className={`my-1 block ${type.cover.amp}`}>&</span>
              <span className="block">{brideShort}</span>
            </h1>
          </div>

          <div
            className="my-5 flex w-[min(100%,11rem)] items-center gap-2.5"
            aria-hidden
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C4A57455] to-[#404A1D]/25" />
            <span className="text-[9px] leading-none text-[#404A1D]/45">♦</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C4A57455] to-[#404A1D]/25" />
          </div>

          <p className={type.cover.date}>{formatDisplayDate(weddingDate)}</p>

          <p className={`mt-4 tracking-[0.06em] ${type.cover.invite}`}>
            Thân Mời
          </p>

          <button
            type="button"
            onClick={handleOpen}
            className={`mt-8 rounded-full bg-[#404A1D] px-12 py-3 text-white shadow-[0_8px_24px_rgba(64,74,29,0.38)] ring-1 ring-white/10 hover:brightness-105 active:scale-[0.98] transition-[transform,filter] ${type.cover.button}`}
          >
            Mở thiệp
          </button>
        </div>
      </div>
    </div>
  );
}
