import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: "div" | "section" | "article" | "footer" | "h2" | "h3";
};

export function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
  as: Tag = "div",
}: Props) {
  const style: CSSProperties | undefined =
    delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined;

  return (
    <Tag
      data-scroll-reveal
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
}
