/** Delay between each reveal target in document / reading order (ms). */
export const SCROLL_REVEAL_STAGGER_MS = 68;

export function scrollRevealDelay(stepIndex: number): number {
  return stepIndex * SCROLL_REVEAL_STAGGER_MS;
}

/** Lines in EventDateBlock (subtitle optional + title, date, place, address). */
export function eventDateBlockLineCount(hasSubtitle: boolean): number {
  return (hasSubtitle ? 1 : 0) + 4;
}
