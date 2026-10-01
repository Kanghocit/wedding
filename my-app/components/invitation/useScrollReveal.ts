"use client";

import { useEffect, type RefObject } from "react";

const REVEAL_SELECTOR = "[data-scroll-reveal]";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function revealElement(el: Element) {
  el.classList.add("is-visible");
}

function collectRevealTargets(content: HTMLElement): Element[] {
  const targets = content.querySelectorAll(REVEAL_SELECTOR);
  if (targets.length > 0) return Array.from(targets);
  return [];
}

type Options = {
  active: boolean;
  scrollRootRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
};

export function useScrollReveal({
  active,
  scrollRootRef,
  contentRef,
}: Options) {
  useEffect(() => {
    if (!active) return;

    const root = scrollRootRef.current;
    const content = contentRef.current;
    if (!root || !content) return;

    const reduced = prefersReducedMotion();

    const observeTargets = () => {
      const targets = collectRevealTargets(content);
      if (targets.length === 0) return null;

      if (reduced) {
        targets.forEach(revealElement);
        return null;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        },
        {
          root,
          threshold: 0.1,
          rootMargin: "0px 0px -2% 0px",
        },
      );

      for (const el of targets) {
        if (el.classList.contains("is-visible")) continue;
        observer.observe(el);
      }

      return observer;
    };

    let observer = observeTargets();

    const mutationObserver = new MutationObserver(() => {
      observer?.disconnect();
      observer = observeTargets();
    });

    mutationObserver.observe(content, {
      childList: true,
      subtree: true,
    });

    const resizeObserver = new ResizeObserver(() => {
      observer?.disconnect();
      observer = observeTargets();
    });
    resizeObserver.observe(content);

    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [active, scrollRootRef, contentRef]);
}
