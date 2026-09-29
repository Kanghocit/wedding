"use client";

import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { colors, modalHeadingClassName, type } from "@/lib/theme";

type Props = {
  open: boolean;
  name: string;
  attending: boolean | null;
  done: boolean;
  submitting: boolean;
  onClose: () => void;
  onNameChange: (v: string) => void;
  onAttendingChange: (v: boolean) => void;
  onSubmit: () => void;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isDesktopViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 640px)").matches;
}

export function RsvpModal({
  open,
  name,
  attending,
  done,
  submitting,
  onClose,
  onNameChange,
  onAttendingChange,
  onSubmit,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const [mounted, setMounted] = useState(open);
  const closingRef = useRef(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      closingRef.current = false;
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (!open) document.body.style.overflow = "";
    };
  }, [open]);

  const animateIn = useCallback(() => {
    const overlay = overlayRef.current;
    const sheet = sheetRef.current;
    if (!overlay || !sheet) return;

    if (prefersReducedMotion()) {
      gsap.set(overlay, { opacity: 1 });
      gsap.set(sheet, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.killTweensOf([overlay, sheet]);
    gsap.set(overlay, { opacity: 0 });

    if (isDesktopViewport()) {
      gsap.set(sheet, { opacity: 0, scale: 0.94, y: 16 });
      gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(sheet, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.42,
        ease: "power3.out",
        delay: 0.05,
      });
    } else {
      gsap.set(sheet, { opacity: 1, y: "100%" });
      gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(sheet, { y: 0, duration: 0.45, ease: "power3.out" });
    }
  }, []);

  const animateOut = useCallback((onComplete: () => void) => {
    const overlay = overlayRef.current;
    const sheet = sheetRef.current;
    if (!overlay || !sheet || prefersReducedMotion()) {
      onComplete();
      return;
    }

    gsap.killTweensOf([overlay, sheet]);
    const tl = gsap.timeline({ onComplete });

    if (isDesktopViewport()) {
      tl.to(sheet, {
        opacity: 0,
        scale: 0.96,
        y: 10,
        duration: 0.28,
        ease: "power2.in",
      }).to(overlay, { opacity: 0, duration: 0.22, ease: "power2.in" }, "-=0.12");
    } else {
      tl.to(sheet, { y: "100%", duration: 0.35, ease: "power3.in" }).to(
        overlay,
        { opacity: 0, duration: 0.25, ease: "power2.in" },
        "-=0.2",
      );
    }
  }, []);

  useEffect(() => {
    if (!mounted || !open) return;
    const id = requestAnimationFrame(() => animateIn());
    return () => cancelAnimationFrame(id);
  }, [mounted, open, animateIn]);

  useEffect(() => {
    if (!done || !successRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      successRef.current,
      { opacity: 0, y: 10, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" },
    );
  }, [done]);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    animateOut(() => {
      closingRef.current = false;
      document.body.style.overflow = "";
      onClose();
      setMounted(false);
    });
  }, [animateOut, onClose]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-black/50 sm:p-4 opacity-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        ref={sheetRef}
        className="modal-sheet w-full sm:max-w-lg bg-[#FFFAF7] shadow-xl max-h-[90vh] overflow-y-auto sm:rounded-2xl"
        role="dialog"
        aria-labelledby="rsvp-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-[#404A1D] px-6 pt-6 pb-4 text-center text-white">
          <button
            type="button"
            aria-label="Đóng"
            className="absolute right-3 top-3 w-8 h-8 rounded-full text-white/80 hover:text-white hover:bg-white/20"
            onClick={requestClose}
          >
            ✕
          </button>
          <h2
            id="rsvp-title"
            className={modalHeadingClassName()}
            style={{ textShadow: "rgba(0,0,0,0.2) 1px 1px 2px" }}
          >
            Xác nhận tham dự
          </h2>
        </div>
        <div className={`p-5 sm:p-6 space-y-4 text-[#404A1D] ${type.bodyUi}`}>
          {done ? (
            <p
              ref={successRef}
              className="text-center py-8 text-sm"
            >
              Cảm ơn bạn! Xác nhận của bạn đã được ghi nhận.
            </p>
          ) : (
            <>
              <p className="text-xs text-center opacity-80 leading-relaxed">
                Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi. Xin xác
                nhận để chúng tôi chuẩn bị chu đáo nhất.
              </p>
              <label className="block text-sm font-medium">
                Tên của bạn
                <input
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  className="mt-1.5 w-full rounded-xl border border-[#404A1D22] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#404A1D55]"
                />
              </label>
              <p className="text-sm font-medium">Bạn sẽ đến chứ?</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 rounded-xl border border-[#404A1D22] bg-white/50 px-4 py-3.5 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="attending"
                    checked={attending === true}
                    onChange={() => onAttendingChange(true)}
                  />
                  Tôi sẽ đến
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-[#404A1D22] bg-white/50 px-4 py-3.5 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="attending"
                    checked={attending === false}
                    onChange={() => onAttendingChange(false)}
                  />
                  Rất tiếc, tôi không thể đến
                </label>
              </div>
              <button
                type="button"
                disabled={submitting || !name.trim() || attending === null}
                onClick={onSubmit}
                className="w-full rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-40 transition-opacity"
                style={{ backgroundColor: colors.modalSubmit }}
              >
                Gửi xác nhận
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
