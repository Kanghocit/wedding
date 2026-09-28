"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { headingClassName, type } from "@/lib/theme";

type Props = {
  onOpen: () => void;
};

export function GiftEnvelopes({ onOpen }: Props) {
  const stackRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const back = backRef.current;
    const front = frontRef.current;
    const shadow = shadowRef.current;
    if (!back || !front || reduced) return;

    gsap.set(back, { rotate: 28, transformOrigin: "85% 92%" });
    gsap.set(front, { rotate: 14, transformOrigin: "25% 92%" });

    const floatBack = gsap.to(back, {
      y: -7,
      rotate: 30,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    const floatFront = gsap.to(front, {
      y: -5,
      duration: 3.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.45,
    });
    const floatShadow = shadow
      ? gsap.to(shadow, {
          scaleX: 1.06,
          opacity: 0.85,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.2,
        })
      : null;

    return () => {
      floatBack.kill();
      floatFront.kill();
      floatShadow?.kill();
    };
  }, []);

  const handleEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(backRef.current, {
      x: 10,
      rotate: 32,
      duration: 0.45,
      ease: "power2.out",
    });
    gsap.to(frontRef.current, {
      x: -6,
      rotate: 11,
      y: -8,
      duration: 0.45,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(backRef.current, {
      x: 0,
      rotate: 28,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(frontRef.current, {
      x: 0,
      rotate: 14,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleClick = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onOpen();
      return;
    }
    const back = backRef.current;
    const front = frontRef.current;
    if (!back || !front) {
      onOpen();
      return;
    }
    gsap
      .timeline({
        onComplete: onOpen,
      })
      .to(front, { scale: 0.96, duration: 0.12, ease: "power2.in" })
      .to([front, back], { scale: 0.94, y: 4, duration: 0.18, ease: "power2.in" }, 0);
  };

  return (
    <section className="relative px-6 md:px-10 pb-8 z-10 text-center overflow-hidden">
      <div
        className="pointer-events-none absolute -right-2 top-0 z-0 h-44 w-44 md:h-52 md:w-52 opacity-[0.28]"
        aria-hidden
      >
        <Image
          src="/themes/hoa.webp"
          alt=""
          fill
          className="object-contain object-right-top"
          sizes="208px"
        />
      </div>

      <h2 className={`${headingClassName()} mb-8 md:mb-10 relative z-10`}>
        HỘP QUÀ MỪNG
      </h2>
      <button
        type="button"
        aria-label="Mở hộp mừng cưới"
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative cursor-pointer bg-transparent border-none outline-none mx-auto block z-10 touch-manipulation"
      >
        <div
          ref={stackRef}
          className="relative mx-auto h-[230px] w-[270px] md:h-[260px] md:w-[310px]"
        >
          <div
            ref={shadowRef}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-2 h-3 w-[62%] rounded-[50%] bg-[#404A1D]/12 blur-md"
            aria-hidden
          />

          {/* Thiệp nhỏ — sau, lệch phải, xoay phải mạnh (~28–30°) */}
          <div
            ref={backRef}
            className="absolute left-[118px] md:left-[136px] bottom-[22px] md:bottom-[26px] z-10 w-[118px] md:w-[132px] will-change-transform"
          >
            <span
              className="sparkle-dot absolute left-[42%] -top-1 z-20 text-[#404A1D]/40 text-[10px] pointer-events-none"
              aria-hidden
            >
              ✦
            </span>
            <Image
              src="/themes/jasmine_white.webp"
              alt=""
              width={420}
              height={614}
              className="w-full h-auto"
            />
          </div>

          {/* Thiệp lớn — trước, lệch trái/giữa, xoay phải nhẹ (~14°) */}
          <div
            ref={frontRef}
            className="absolute left-[28px] md:left-[34px] bottom-0 z-20 w-[168px] md:w-[188px] will-change-transform drop-shadow-[0_16px_36px_rgba(64,74,29,0.22)]"
          >
            <span
              className="sparkle-dot absolute left-[38%] -top-0.5 z-20 text-[#404A1D]/32 text-[9px] pointer-events-none"
              style={{ animationDelay: "0.3s" }}
              aria-hidden
            >
              ✦
            </span>
            <span
              className="sparkle-dot absolute left-[48%] -top-2 z-20 text-[#404A1D]/22 text-[8px] pointer-events-none"
              style={{ animationDelay: "0.55s" }}
              aria-hidden
            >
              ✦
            </span>
            <Image
              src="/themes/jasmine_white.webp"
              alt=""
              width={420}
              height={614}
              className="w-full h-auto"
            />
          </div>
        </div>
        <p className={`mt-2 ${type.giftHint}`}>Nhấn để mở</p>
      </button>
    </section>
  );
}
