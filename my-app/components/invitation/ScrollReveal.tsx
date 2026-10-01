import type { CSSProperties, ReactNode } from "react";

export type ScrollRevealVariant = "up" | "left" | "right";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  variant?: ScrollRevealVariant;
  as?: "div" | "section" | "article" | "footer" | "h2" | "h3" | "p";
};

export function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
  variant = "up",
  as: Tag = "div",
}: Props) {
  const style: CSSProperties | undefined =
    delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined;

  return (
    <Tag
      data-scroll-reveal
      data-scroll-reveal-variant={variant}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
}
