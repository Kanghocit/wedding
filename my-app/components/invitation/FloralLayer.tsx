"use client";

import Image from "next/image";
import { layout } from "@/lib/theme";

type Props = {
  className?: string;
  flip?: boolean;
  rotate?: number;
  opacity?: number;
  parallaxY?: number;
  extraTransform?: string;
  style?: React.CSSProperties;
};

export function FloralLayer({
  className = "",
  flip,
  rotate = 0,
  opacity = 0.3,
  parallaxY = 0,
  extraTransform = "",
  style,
}: Props) {
  const transform = [
    extraTransform,
    flip ? "scaleX(-1) scaleY(-1)" : "",
    rotate ? `rotate(${rotate}deg)` : "",
    parallaxY ? `translateY(${parallaxY}px)` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`pointer-events-none absolute z-0 ${layout.floralW} ${className}`}
      style={{ opacity, transform, willChange: "transform", ...style }}
      aria-hidden
    >
      <Image
        src="/themes/hoa.webp"
        alt=""
        width={1200}
        height={1167}
        className="w-full h-auto block"
      />
    </div>
  );
}
