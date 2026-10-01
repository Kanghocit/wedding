import type { ReactNode } from "react";
import { SCROLL_REVEAL_STAGGER_MS } from "@/lib/scroll-reveal-timing";
import { ScrollReveal } from "./ScrollReveal";

type Line = {
  node: ReactNode;
  className?: string;
};

type Props = {
  lines: Line[];
  className?: string;
  startDelayMs?: number;
  stepMs?: number;
};

/** Each line reveals upward with staggered delay when scrolled into view. */
export function ScrollRevealLines({
  lines,
  className = "",
  startDelayMs = 0,
  stepMs = SCROLL_REVEAL_STAGGER_MS,
}: Props) {
  return (
    <div className={className}>
      {lines.map((line, index) => (
        <ScrollReveal
          key={index}
          as="p"
          variant="up"
          delayMs={startDelayMs + index * stepMs}
          className={line.className}
        >
          {line.node}
        </ScrollReveal>
      ))}
    </div>
  );
}
