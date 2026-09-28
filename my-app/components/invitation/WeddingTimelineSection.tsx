"use client";

import type { TimelineItem } from "@/lib/types";
import { headingClassName, type } from "@/lib/theme";

type Props = {
  items: TimelineItem[];
};

export function WeddingTimelineSection({ items }: Props) {
  if (!items.length) return null;

  return (
    <section className="relative px-6 md:px-10 pb-12 md:pb-16 z-10">
      <h2 className={`${headingClassName()} mb-10 md:mb-12`}>
        LỊCH TRÌNH NGÀY CƯỚI
      </h2>

      <div className="relative mx-auto w-full max-w-[min(100%,22rem)] md:max-w-md">
        <div
          className="pointer-events-none absolute left-1/2 top-1 bottom-1 w-px -translate-x-1/2 bg-[#404A1D]/28"
          aria-hidden
        />

        <ul className="relative space-y-7 md:space-y-8">
          {items.map((item) => (
            <li
              key={`${item.time}-${item.label}`}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 md:gap-x-4"
            >
              <span className={`text-right ${type.timelineTime}`}>
                {item.time}
              </span>
              <span
                className="relative z-10 h-2 w-2 shrink-0 rounded-full bg-[#404A1D] ring-4 ring-[#FFFAF7]"
                aria-hidden
              />
              <span className={`text-left ${type.timelineLabel}`}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
