"use client";

import type { WishEntry } from "@/lib/types";
import { headingClassName, type } from "@/lib/theme";

type Props = {
  wishes: WishEntry[];
  wishName: string;
  wishMessage: string;
  submitting: boolean;
  onNameChange: (v: string) => void;
  onMessageChange: (v: string) => void;
  onSuggest: () => void;
  onSubmit: () => void;
  formatTime: (iso: string) => string;
};

const fieldClass = `w-full rounded-lg border border-[#404A1D20] bg-white px-4 py-3 text-[#404A1D] outline-none transition-colors placeholder:text-[#404A1D]/45 focus:border-[#404A1D]/50 ${type.bodySerif}`;

export function GuestbookSection({
  wishes,
  wishName,
  wishMessage,
  submitting,
  onNameChange,
  onMessageChange,
  onSuggest,
  onSubmit,
  formatTime,
}: Props) {
  return (
    <section className="relative px-6 md:px-10 pt-6 md:pt-10 pb-8 md:pb-10 z-10">
      <h2 className={`${headingClassName()} mb-6 md:mb-8`}>SỔ LƯU BÚT</h2>

      <div className="mx-auto max-w-full md:max-w-[560px]">
        <div className="rounded-[1.25rem] bg-white px-5 py-5 md:px-6 md:py-6 shadow-[0_10px_40px_rgba(64,74,29,0.1)]">
          <div className="space-y-3 md:space-y-4">
            <input
              required
              placeholder="Nhập tên của bạn*"
              value={wishName}
              onChange={(e) => onNameChange(e.target.value)}
              className={fieldClass}
            />
            <textarea
              required
              placeholder="Nhập lời chúc của bạn*"
              value={wishMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={4}
              className={`${fieldClass} min-h-[120px] resize-none leading-relaxed`}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              aria-label="Gợi ý lời chúc"
              onClick={onSuggest}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#404A1D14] bg-[#404A1D]/[0.06] text-xl transition-colors hover:bg-[#404A1D]/10 active:scale-95"
            >
              <span aria-hidden>🪄</span>
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={onSubmit}
              className={`min-h-11 flex-1 rounded-full bg-[#404A1D] px-6 py-3 text-sm font-normal tracking-[0.14em] text-white transition-transform hover:brightness-105 active:scale-[0.99] disabled:opacity-50 ${type.bodySerif}`}
            >
              GỬI LỜI CHÚC
            </button>
          </div>
        </div>

        <div className="mt-8 max-h-[500px] space-y-3 overflow-y-auto pr-1 scrollbar-thin">
          {wishes.map((w) => (
            <article
              key={w.id}
              className={`rounded-xl border border-[#404A1D12] bg-white/70 px-4 py-3 text-left shadow-[0_4px_16px_rgba(64,74,29,0.05)] ${type.bodySerif}`}
            >
              <p className="font-semibold text-[#404A1D]">{w.name}</p>
              <p className={`${type.caption} opacity-50 mt-0.5`}>
                {formatTime(w.createdAt)}
              </p>
              <p className="mt-2 leading-relaxed opacity-90">{w.message}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
