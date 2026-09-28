import {
  formatLunarLine,
  getDayMonthYear,
  getWeekdayVi,
} from "@/lib/date-utils";

export function DateDisplay({
  isoDate,
  time,
  showSubTimes,
  receptionTime,
  partyTime,
}: {
  isoDate: string;
  time: string;
  showSubTimes?: boolean;
  receptionTime?: string;
  partyTime?: string;
}) {
  const { day, month, year } = getDayMonthYear(isoDate);
  const weekday = getWeekdayVi(isoDate);
  const lunar = formatLunarLine(isoDate);

  return (
    <div className="flex flex-col items-center gap-1 text-[#404A1D]">
      <p className="text-xs md:text-sm tracking-[0.2em] opacity-80 mt-2">VÀO LÚC</p>
      <p
        className="text-[2.5rem] md:text-[3.25rem] leading-none font-[family-name:var(--font-garamond)]"
        style={{ fontSize: "clamp(2.25rem, 8vw, 3.25rem)" }}
      >
        {time}
      </p>
      <div className="flex items-center gap-2 md:gap-3 text-[11px] md:text-sm tracking-[0.12em] mt-2">
        <span className="uppercase">{weekday}</span>
        <span className="opacity-35">|</span>
        <span
          className="font-light leading-none"
          style={{ fontSize: "clamp(1.75rem, 6vw, 2.5rem)" }}
        >
          {day}
        </span>
        <span className="opacity-35">|</span>
        <span className="uppercase">THÁNG {String(month).padStart(2, "0")}</span>
      </div>
      <p className="text-base md:text-lg tracking-wide mt-1">{year}</p>
      <p className="text-[10px] md:text-[11px] opacity-70 text-center px-4 mt-1 leading-relaxed">
        {lunar}
      </p>
      {showSubTimes && receptionTime && partyTime && (
        <div className="flex gap-10 md:gap-12 mt-5 text-[10px] md:text-xs tracking-[0.15em]">
          <div className="text-center">
            <p className="opacity-70">ĐÓN KHÁCH</p>
            <p className="text-lg md:text-xl mt-1 font-[family-name:var(--font-garamond)]">
              {receptionTime}
            </p>
          </div>
          <div className="text-center">
            <p className="opacity-70">KHAI TIỆC</p>
            <p className="text-lg md:text-xl mt-1 font-[family-name:var(--font-garamond)]">
              {partyTime}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
