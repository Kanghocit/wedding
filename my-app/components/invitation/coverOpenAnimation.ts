import { gsap } from "gsap";

export type CoverOpenTargets = {
  backdrop: HTMLElement;
  backdropBlur: HTMLElement;
  stage: HTMLElement;
  openButton: HTMLElement;
  ovals: Element[];
  petals: Element[];
};

function coverLiftDistance(): number {
  if (typeof window === "undefined") return 360;
  return Math.min(window.innerHeight * 0.52, 440);
}

export function runCoverOpenTimeline(
  targets: CoverOpenTargets,
  onComplete: () => void,
): gsap.core.Timeline {
  const { backdrop, backdropBlur, stage, openButton, ovals, petals } =
    targets;

  gsap.killTweensOf([
    backdrop,
    backdropBlur,
    stage,
    openButton,
    ...ovals,
    ...petals,
  ]);

  gsap.set(stage, { y: 0, scale: 1, opacity: 1, force3D: true });

  const tl = gsap.timeline({ onComplete });

  tl.call(
    () => {
      stage.classList.add("cover-is-opening");
      backdropBlur.classList.add("cover-backdrop-blur--active");
    },
    [],
    0,
  );

  tl.to(
    openButton,
    { scale: 0.94, opacity: 0, duration: 0.16, ease: "power2.in" },
    0,
  );

  tl.to(
    stage,
    {
      y: () => -coverLiftDistance(),
      scale: 0.9,
      duration: 0.88,
      ease: "power2.inOut",
      force3D: true,
    },
    0.05,
  ).to(
    stage,
    { opacity: 0, duration: 0.32, ease: "power2.in" },
    0.58,
  );

  tl.to(backdrop, { opacity: 0, duration: 0.55, ease: "power2.inOut" }, 0.32)
    .to(
      backdropBlur,
      { opacity: 0, duration: 0.45, ease: "power2.in" },
      0.36,
    )
    .to(
      ovals,
      { opacity: 0, duration: 0.38, ease: "power2.in" },
      0.34,
    )
    .to(
      petals,
      {
        y: "-=28",
        opacity: 0,
        duration: 0.42,
        stagger: 0.01,
        ease: "power2.out",
      },
      0.38,
    );

  return tl;
}
