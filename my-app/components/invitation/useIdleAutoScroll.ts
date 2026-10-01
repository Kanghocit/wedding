"use client";

import { useEffect, useRef, type RefObject } from "react";

const SCROLL_SPEED_PX_PER_SEC = 44;
const START_DELAY_MS = 2200;
const USER_LISTENER_DELAY_MS = 2800;
const BOTTOM_THRESHOLD_PX = 40;
const MIN_EXTRA_SCROLL_PX = 160;

type Options = {
  active: boolean;
  paused: boolean;
  scrollRootRef: RefObject<HTMLElement | null>;
  restartKey: number;
};

function maxScrollFor(root: HTMLElement): number {
  return Math.max(0, root.scrollHeight - root.clientHeight);
}

function readyToAutoScroll(root: HTMLElement): boolean {
  const max = maxScrollFor(root);
  return max >= Math.max(MIN_EXTRA_SCROLL_PX, root.clientHeight * 0.2);
}

export function useIdleAutoScroll({
  active,
  paused,
  scrollRootRef,
  restartKey,
}: Options) {
  const userPausedRef = useRef(false);

  useEffect(() => {
    const root = scrollRootRef.current;

    if (!active || !root) {
      userPausedRef.current = false;
      return;
    }

    userPausedRef.current = false;

    let cancelled = false;
    let rafId = 0;
    let startTimer: ReturnType<typeof setTimeout> | null = null;
    let listenerTimer: ReturnType<typeof setTimeout> | null = null;
    let waitRaf = 0;
    let lastFrame = 0;
    let listenersAttached = false;
    let detachListeners: (() => void) | null = null;

    const cancelRaf = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      if (waitRaf) cancelAnimationFrame(waitRaf);
      waitRaf = 0;
      lastFrame = 0;
    };

    const stopForUser = () => {
      userPausedRef.current = true;
      cancelRaf();
    };

    const attachUserListeners = () => {
      if (listenersAttached || cancelled) return;
      listenersAttached = true;

      let touchY: number | null = null;

      const onWheel = (e: WheelEvent) => {
        if (!e.isTrusted) return;
        if (Math.abs(e.deltaY) > 4) stopForUser();
      };

      const onTouchStart = (e: TouchEvent) => {
        touchY = e.touches[0]?.clientY ?? null;
      };

      const onTouchMove = (e: TouchEvent) => {
        if (touchY == null) return;
        const y = e.touches[0]?.clientY ?? touchY;
        if (Math.abs(y - touchY) > 12) stopForUser();
      };

      root.addEventListener("wheel", onWheel, { passive: true });
      root.addEventListener("touchstart", onTouchStart, { passive: true });
      root.addEventListener("touchmove", onTouchMove, { passive: true });

      detachListeners = () => {
        root.removeEventListener("wheel", onWheel);
        root.removeEventListener("touchstart", onTouchStart);
        root.removeEventListener("touchmove", onTouchMove);
      };
    };

    const tick = (now: number) => {
      if (cancelled || userPausedRef.current) return;

      if (paused) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const max = maxScrollFor(root);
      if (!readyToAutoScroll(root)) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (root.scrollTop >= max - BOTTOM_THRESHOLD_PX) {
        root.scrollTop = max;
        cancelRaf();
        return;
      }

      if (!lastFrame) lastFrame = now;
      const dt = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;

      const step = SCROLL_SPEED_PX_PER_SEC * dt;
      const next = Math.min(root.scrollTop + step, max);
      root.scrollTop = next;

      rafId = requestAnimationFrame(tick);
    };

    const beginLoop = () => {
      if (cancelled || userPausedRef.current) return;
      const alreadyRunning = rafId !== 0;
      cancelRaf();
      lastFrame = 0;
      rafId = requestAnimationFrame(tick);

      if (alreadyRunning || listenersAttached) return;
      if (listenerTimer) clearTimeout(listenerTimer);
      listenerTimer = setTimeout(() => {
        listenerTimer = null;
        attachUserListeners();
      }, USER_LISTENER_DELAY_MS);
    };

    const waitThenBegin = () => {
      if (cancelled) return;
      if (readyToAutoScroll(root)) {
        beginLoop();
        return;
      }
      waitRaf = requestAnimationFrame(waitThenBegin);
    };

    startTimer = setTimeout(() => {
      startTimer = null;
      waitThenBegin();
    }, START_DELAY_MS);

    const ro = new ResizeObserver(() => {
      if (cancelled || userPausedRef.current || paused) return;
      if (!readyToAutoScroll(root)) return;
      if (!rafId) beginLoop();
    });
    ro.observe(root);
    const inner = root.firstElementChild;
    if (inner) ro.observe(inner);
    const main = root.querySelector("[data-testid='mai-lan-white-template']");
    if (main) ro.observe(main);

    return () => {
      cancelled = true;
      ro.disconnect();
      if (startTimer) clearTimeout(startTimer);
      if (listenerTimer) clearTimeout(listenerTimer);
      detachListeners?.();
      cancelRaf();
    };
  }, [active, paused, restartKey, scrollRootRef]);
}
