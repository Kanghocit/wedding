import {
  buildMonthGrid,
  formatDisplayDate,
  getDayMonthYear,
} from "@/lib/date-utils";
import type { PublicWeddingConfig } from "@/lib/config";
import type { PreEventInfo } from "@/lib/types";
import { headingClassName, type as typeTokens } from "@/lib/theme";
import type { PartySide } from "./PartyVenuesSection";
import { EventDateBlock } from "./EventDateBlock";
import { ScrollReveal } from "./ScrollReveal";

type Props = Pick<
  PublicWeddingConfig,
  | "groomFather"
  | "groomMother"
  | "brideFather"
  | "brideMother"
  | "groomAddress"
  | "brideAddress"
  | "groomFullName"
  | "brideFullName"
  | "ceremonyHeader"
  | "ceremonyPlace"
  | "weddingDate"
> & {
  partySide?: PartySide;
  preEvent?: PreEventInfo | null;
  ceremonyTime: string;
  calendarLink: string;
  preEventCalendarLink?: string | null;
  onRsvp: () => void;
};

function FamilyBlock({
  father,
  mother,
  address,
}: {
  father: string;
  mother: string;
  address: string;
}) {
  return (
    <div className="min-w-0">
      <p className={`${typeTokens.caption} mb-3`}>Ông Bà</p>
      <p className={`${typeTokens.bodySerif} leading-snug`}>{father}</p>
      <p className={`${typeTokens.bodySerif} leading-snug`}>{mother}</p>
      <p
        className={`mt-3 px-1 leading-relaxed ${typeTokens.addressSerif}`}
      >
        {address}
      </p>
    </div>
  );
}

export function CeremonySection({
  partySide,
  preEvent,
  calendarLink,
  preEventCalendarLink,
  ceremonyTime,
  onRsvp,
  ...config
}: Props) {
  const groomFirst = partySide !== "bride";

  const weddingParts = getDayMonthYear(config.weddingDate);
  const preEventSameMonth =
    preEvent != null &&
    (() => {
      const p = getDayMonthYear(preEvent.date);
      return p.month === weddingParts.month && p.year === weddingParts.year;
    })();
  const secondaryDays =
    preEvent && preEventSameMonth ? [getDayMonthYear(preEvent.date).day] : [];
  const calendarCells = buildMonthGrid(config.weddingDate, secondaryDays);
  const { month, year } = weddingParts;

  const ceremonyAddress =
    partySide === "groom"
      ? config.groomAddress
      : partySide === "bride"
        ? config.brideAddress
        : config.brideAddress;

  const groomFamily = (
    <FamilyBlock
      father={config.groomFather}
      mother={config.groomMother}
      address={config.groomAddress}
    />
  );
  const brideFamily = (
    <FamilyBlock
      father={config.brideFather}
      mother={config.brideMother}
      address={config.brideAddress}
    />
  );

  const groomNameBlock = (
    <h3 className={typeTokens.ceremonyName}>{config.groomFullName}</h3>
  );
  const brideNameBlock = (
    <h3 className={typeTokens.ceremonyName}>{config.brideFullName}</h3>
  );

  return (
    <>
      <ScrollReveal as="h2" className={headingClassName()}>
        THÔNG TIN LỄ CƯỚI
      </ScrollReveal>

      <ScrollReveal
        delayMs={80}
        className={`ceremony-families-row ${typeTokens.bodySerif}`}
      >
        {groomFirst ? groomFamily : brideFamily}
        {groomFirst ? brideFamily : groomFamily}
      </ScrollReveal>

      <ScrollReveal
        delayMs={160}
        className="text-center space-y-4 md:space-y-5"
      >
        <p className={typeTokens.ceremonyIntro}>TRÂN TRỌNG BÁO TIN</p>
        <p className={`${typeTokens.ceremonyIntro} tracking-[0.15em]`}>
          LỄ THÀNH HÔN CỦA CON CHÚNG TÔI
        </p>
        {groomFirst ? (
          <>
            {groomNameBlock}
            <p
              className="font-[family-name:var(--font-script)] text-[#404A1D]"
              style={{ fontSize: typeTokens.ceremonyAmp, lineHeight: 1.15 }}
            >
              &
            </p>
            {brideNameBlock}
          </>
        ) : (
          <>
            {brideNameBlock}
            <p
              className="font-[family-name:var(--font-script)] text-[#404A1D]"
              style={{ fontSize: typeTokens.ceremonyAmp, lineHeight: 1.15 }}
            >
              &
            </p>
            {groomNameBlock}
          </>
        )}
      </ScrollReveal>

      {preEvent ? (
        <ScrollReveal delayMs={240}>
          <EventDateBlock
            subtitle={preEvent.subtitle}
            title={preEvent.title}
            isoDate={preEvent.date}
            time={preEvent.time}
            place={preEvent.place}
            address={preEvent.address}
            className="pt-2 text-center"
          />
        </ScrollReveal>
      ) : null}

      <ScrollReveal delayMs={preEvent ? 320 : 240}>
        <EventDateBlock
          subtitle={undefined}
          title={config.ceremonyHeader}
          isoDate={config.weddingDate}
          time={ceremonyTime}
          place={config.ceremonyPlace}
          address={ceremonyAddress}
          className={`text-center ${preEvent ? "pt-4 md:pt-6" : "pt-4"}`}
        />
      </ScrollReveal>

      <ScrollReveal
        delayMs={preEvent ? 400 : 320}
        className="mx-auto max-w-[280px] md:max-w-xs pt-6 md:pt-8 text-center"
      >
        <p className={`${typeTokens.caption} mb-3 opacity-80`}>
          Tháng {month} / {year}
        </p>
        <div className={`grid grid-cols-7 gap-0.5 ${typeTokens.caption}`}>
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
                className={`py-1.5 rounded-full ${
                  cell.isWeddingDay
                    ? "bg-[#404A1D] text-white font-semibold"
                    : cell.isSecondaryDay
                      ? "ring-1 ring-[#404A1D]/35 bg-[#404A1D]/10 font-medium"
                      : ""
                }`}
              >
                {cell.day}
              </span>
            ),
          )}
        </div>
        {preEvent && !preEventSameMonth ? (
          <p
            className={`${typeTokens.caption} mt-4 opacity-80 px-2 leading-relaxed`}
          >
            {preEvent.title}: {formatDisplayDate(preEvent.date)},{" "}
            {preEvent.time}
          </p>
        ) : null}
        <div className="flex flex-col gap-3 mt-6">
          <a
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`${typeTokens.hintLink} underline inline-flex items-center justify-center`}
          >
            Thêm vào lịch
          </a>

          <button
            type="button"
            onClick={onRsvp}
            className={`${typeTokens.bodyUi} text-sm md:text-base tracking-[0.12em] inline-flex items-center justify-center rounded-full px-6 py-2.5 font-semibold text-white bg-[#404A1D] hover:scale-[1.03] active:scale-[0.98] transition-transform`}
          >
            XÁC NHẬN THAM DỰ
          </button>
        </div>
      </ScrollReveal>
    </>
  );
}
