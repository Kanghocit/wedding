export const DEFAULT_INITIAL_INDEX = 4;
export const AUTO_ADVANCE_MS = 5800;
export const AUTO_PAUSE_AFTER_INTERACTION_MS = 14000;
export const CARD_HEIGHT_RATIO = 1.82;

export type LayoutMetrics = {
  stageW: number;
  stageH: number;
  slideW: number;
};

export function measureLayout(): LayoutMetrics {
  if (typeof window === "undefined") {
    return { stageW: 360, stageH: 655, slideW: 280 };
  }
  const vw = window.innerWidth;
  const narrow = vw < 768;
  const stageW = narrow
    ? Math.round(Math.min(vw - 32, 520))
    : Math.round(Math.min(vw - 96, 760));
  const slideW = narrow
    ? Math.round(Math.min(stageW * 0.78, 320))
    : Math.round(Math.min(stageW * 0.44, 348));
  const stageH = Math.round(slideW * CARD_HEIGHT_RATIO);
  return { stageW, stageH, slideW };
}

export function clampInitialIndex(length: number): number {
  if (length <= 0) return 0;
  return Math.min(DEFAULT_INITIAL_INDEX, length - 1);
}
