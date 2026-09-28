"use client";

import { useCountdown } from "./useCountdown";

type Props = {
  targetMs: number;
};

function CountdownCell({ value }: { value: string }) {
  return (
    <div
      className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-2xl border border-[#C4A57455] bg-white/90 shadow-sm md:h-14 md:w-14"
      aria-hidden
    >
      <span className="font-[family-name:var(--font-garamond)] text-xl tabular-nums text-[#404A1D] md:text-2xl">
        {value}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span
      className="font-[family-name:var(--font-garamond)] text-lg text-[#404A1D]/80 md:text-xl"
      aria-hidden
    >
      :
    </span>
  );
}

export function WeddingCountdown({ targetMs }: Props) {
  const { days, hours, minutes, seconds, parts } = useCountdown(targetMs);

  const ariaSummary = `Còn ${parts.days} ngày ${parts.hours} giờ ${parts.minutes} phút ${parts.seconds} giây`;

  return (
    <section
      className="flex w-full flex-col items-center px-3 text-[#404A1D]"
      aria-label="Đếm ngược thời gian"
    >
      <div
        className="mb-4 h-[2px] w-[min(12rem,70%)] bg-gradient-to-r from-transparent via-[#C4A57466] to-transparent"
        aria-hidden
      />

      <h2 className="font-[family-name:var(--font-script)] text-2xl font-normal leading-tight md:text-[1.75rem]">
        Đếm ngược thời gian
      </h2>

      <div
        className="mt-5 flex items-center justify-center gap-1.5 md:mt-6 md:gap-2"
        role="timer"
        aria-live="polite"
      >
        <span className="sr-only">{ariaSummary}</span>
        <CountdownCell value={days} />
        <Separator />
        <CountdownCell value={hours} />
        <Separator />
        <CountdownCell value={minutes} />
        <Separator />
        <CountdownCell value={seconds} />
      </div>
    </section>
  );
}
