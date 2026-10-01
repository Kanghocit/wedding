"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { runCoverOpenTimeline } from "@/components/invitation/coverOpenAnimation";
import { CoverFallingPetals } from "@/components/invitation/CoverFallingPetals";
import { formatDisplayDate } from "@/lib/date-utils";
import { colors, type } from "@/lib/theme";

type Props = {
  groomShort: string;
  brideShort: string;
  weddingDate: string;
  inviteLine?: string;
  onOpenStart: () => void;
  onDismiss: () => void;
};

export function EnvelopeCover({
  groomShort,
  brideShort,
  weddingDate,
  inviteLine,
  onOpenStart,
  onDismiss,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const backdropBlurRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const floralsRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const root = rootRef.current;
    const stage = stageRef.current;
    const florals = floralsRef.current;
    if (!root || reduced) return;

    const ovals = root.querySelectorAll("[data-cover-oval]");

    if (stage) {
      gsap.set(stage, { opacity: 0, scale: 0.94, y: 20 });
      gsap.to(stage, {
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
      gsap.killTweensOf([stage, florals, ...ovals].filter(Boolean));
    };
  }, []);

  const finishOpen = () => {
    document.body.style.overflow = "";
    onDismiss();
  };

  const handleOpen = () => {
    if (openingRef.current) return;
    openingRef.current = true;
    onOpenStart();

    const root = rootRef.current;
    const backdrop = backdropRef.current;
    const backdropBlur = backdropBlurRef.current;
    const stage = stageRef.current;
    const openButton = openButtonRef.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (
      !root ||
      !backdrop ||
      !backdropBlur ||
      !stage ||
      !openButton ||
      reduced
    ) {
      finishOpen();
      return;
    }

    document.body.style.overflow = "hidden";
    const ovals = Array.from(root.querySelectorAll("[data-cover-oval]"));
    const petals = Array.from(root.querySelectorAll(".petal"));

    runCoverOpenTimeline(
      {
        backdrop,
        backdropBlur,
        stage,
        openButton,
        ovals,
        petals,
      },
      finishOpen,
    );
  };

  const cardShell =
    "cover-card-shell overflow-hidden rounded-[1.35rem] bg-[#FFFAF7] text-center text-[#404A1D]";

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4"
    >
      <div
        ref={backdropRef}
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: colors.olive }}
        aria-hidden
      />
      <div ref={backdropBlurRef} className="cover-backdrop-blur" aria-hidden />

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

      <div ref={stageRef} className="cover-float-stage relative z-10">
        <div className={`relative ${cardShell}`}>
          <div
            ref={floralsRef}
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[1.35rem]"
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
            <div className="absolute -right-2 top-6 h-[6rem] w-[6rem] scale-x-[-1] opacity-85 saturate-[1.08] md:h-[7rem] md:w-[7rem]">
              <Image
                src="/themes/hoa.webp"
                alt=""
                fill
                className="object-contain object-right-top drop-shadow-[0_2px_8px_rgba(64,74,29,0.12)]"
                sizes="112px"
                priority
              />
            </div>
          </div>

          <div className="relative z-20 flex flex-col items-center px-7 pt-9 pb-8 md:px-9 md:pt-10 md:pb-9">
            <div
              className="pointer-events-none absolute left-1/2 top-[2.5rem] -z-10 h-[10rem] w-[min(100%,14.5rem)] -translate-x-1/2 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,#FFFAF7_0%,rgba(255,250,247,0.88)_42%,transparent_72%)]"
              aria-hidden
            />

            <div className="mb-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#404A1D] text-[12px] text-white shadow-[0_4px_14px_rgba(64,74,29,0.28)] ring-2 ring-[#FFFAF7]">
              ♥
            </div>

            <div className="relative w-full max-w-[15rem] mx-auto px-1">
              <h1
                className={`${type.cover.name} [text-shadow:0_1px_0_rgba(255,250,247,0.98),0_2px_12px_rgba(255,250,247,0.65)]`}
              >
                <span className="block">{groomShort}</span>
                <span className={`my-1 block ${type.cover.amp}`}>&</span>
                <span className="block">{brideShort}</span>
              </h1>
            </div>

            <div
              className="my-5 flex w-[min(100%,11rem)] mx-auto items-center gap-2.5"
              aria-hidden
            >
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C4A57455] to-[#404A1D]/25" />
              <span className="text-[9px] leading-none text-[#404A1D]/45">
                ♦
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C4A57455] to-[#404A1D]/25" />
            </div>

            <p className={type.cover.date}>{formatDisplayDate(weddingDate)}</p>

            <p className={`mt-6 tracking-[0.06em] ${type.cover.invite}`}>
              Trân trọng kính mời
            </p>
            {inviteLine ? (
              <div className="mt-3 max-w-[18rem] mx-auto space-y-2">
                <p className={`leading-snug ${type.inviteGuestName}`}>
                  {inviteLine}
                </p>
              </div>
            ) : null}

            <button
              ref={openButtonRef}
              type="button"
              onClick={handleOpen}
              className={`mt-8 rounded-full bg-[#404A1D] px-12 py-3 text-white shadow-[0_8px_24px_rgba(64,74,29,0.38)] ring-1 ring-white/10 hover:brightness-105 active:scale-[0.98] transition-[transform,filter] ${type.cover.button}`}
            >
              Mở thiệp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
