import { buildMonthGrid, getDayMonthYear } from "@/lib/date-utils";
import { headingClassName, type } from "@/lib/theme";
import { DateDisplay } from "./DateDisplay";

type Props = {
  weddingDate: string;
  partyTime: string;
  guestReceptionTime: string;
  calendarLink: string;
  onRsvp: () => void;
};

export function PartyCalendarSection({
  weddingDate,
  partyTime,
  guestReceptionTime,
  calendarLink,
  onRsvp,
}: Props) {
  const calendarCells = buildMonthGrid(weddingDate);
  const { month, year } = getDayMonthYear(weddingDate);

  return (
    <div className="text-center space-y-5 md:space-y-6">
      <h2 className={headingClassName()}>THÔNG TIN TIỆC CƯỚI</h2>
      <h3 className={`${type.sectionSubheading} px-2`}>
        TIỆC CƯỚI SẼ DIỄN RA VÀO LÚC:
      </h3>
      <DateDisplay
        isoDate={weddingDate}
        time={partyTime}
        showSubTimes
        receptionTime={guestReceptionTime}
        partyTime={partyTime}
      />

      <div className="mx-auto max-w-[280px] md:max-w-xs pt-2">
        <p className={`${type.caption} mb-3 opacity-80`}>
          Tháng {month} / {year}
        </p>
        <div className={`grid grid-cols-7 gap-0.5 ${type.caption}`}>
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
            <span key={d} className="opacity-55 py-1.5 font-light">
              {d}
            </span>
          ))}
          {calendarCells.map((cell, idx) =>
            cell.day === null ? (
              <span key={`e-${idx}`} className="py-1.5" />
            ) : (
              <span
                key={`d-${cell.day}`}
                className={`py-1.5 rounded-full ${cell.isWeddingDay ? "bg-[#404A1D] text-white font-semibold" : ""}`}
              >
                {cell.day}
              </span>
            ),
          )}
        </div>
        <div className="flex flex-col gap-3 mt-6">
          <a
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`${type.hintLink} underline inline-flex items-center justify-center`}
          >
            Thêm vào lịch
          </a>
          <button
            type="button"
            onClick={onRsvp}
            className={`${type.bodyUi} text-sm md:text-base tracking-[0.12em] inline-flex items-center justify-center rounded-full px-6 py-2.5 font-semibold text-white bg-[#404A1D] hover:scale-[1.03] active:scale-[0.98] transition-transform`}
          >
            XÁC NHẬN THAM DỰ
          </button>
        </div>
      </div>
    </div>
  );
}
