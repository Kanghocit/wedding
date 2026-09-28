import { Solar } from "lunar-javascript";

const WEEKDAY_VI = [
  "CHỦ NHẬT",
  "THỨ HAI",
  "THỨ BA",
  "THỨ TƯ",
  "THỨ NĂM",
  "THỨ SÁU",
  "THỨ BẢY",
] as const;

const STEM_VI: Record<string, string> = {
  甲: "Giáp",
  乙: "Ất",
  丙: "Bính",
  丁: "Đinh",
  戊: "Mậu",
  己: "Kỷ",
  庚: "Canh",
  辛: "Tân",
  壬: "Nhâm",
  癸: "Quý",
};
const BRANCH_VI: Record<string, string> = {
  子: "Tý",
  丑: "Sửu",
  寅: "Dần",
  卯: "Mão",
  辰: "Thìn",
  巳: "Tỵ",
  午: "Ngọ",
  未: "Mùi",
  申: "Thân",
  酉: "Dậu",
  戌: "Tuất",
  亥: "Hợi",
};

function ganZhiVi(gz: string): string {
  if (gz.length < 2) return gz;
  const stem = STEM_VI[gz[0]] ?? gz[0];
  const branch = BRANCH_VI[gz[1]] ?? gz[1];
  return `${stem} ${branch}`;
}

export function parseWeddingDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function formatDisplayDate(isoDate: string): string {
  const d = parseWeddingDate(isoDate);
  return `${d.getDate()} tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
}

export function getWeekdayVi(isoDate: string): string {
  return WEEKDAY_VI[parseWeddingDate(isoDate).getDay()];
}

export function getDayMonthYear(isoDate: string): {
  day: number;
  month: number;
  year: number;
} {
  const d = parseWeddingDate(isoDate);
  return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
}

export function formatLunarLine(isoDate: string): string {
  const { year, month, day } = getDayMonthYear(isoDate);
  const lunar = Solar.fromYmd(year, month, day).getLunar();
  const yearName = ganZhiVi(lunar.getYearInGanZhi()).toUpperCase();
  return `(TỨC NGÀY ${lunar.getDay()} THÁNG ${lunar.getMonth()} NĂM ${yearName})`;
}

export type CalendarCell = {
  day: number | null;
  isWeddingDay: boolean;
  isSecondaryDay: boolean;
};

export function buildMonthGrid(
  isoDate: string,
  secondaryHighlightDays: number[] = [],
): CalendarCell[] {
  const { year, month, day: weddingDay } = getDayMonthYear(isoDate);
  const first = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startOffset = (first.getDay() + 6) % 7;
  const secondary = new Set(
    secondaryHighlightDays.filter((d) => d >= 1 && d <= daysInMonth),
  );

  const cells: CalendarCell[] = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: null, isWeddingDay: false, isSecondaryDay: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      isWeddingDay: d === weddingDay,
      isSecondaryDay: d !== weddingDay && secondary.has(d),
    });
  }
  return cells;
}

const VIETNAM_TZ_ALIASES = new Set(["Asia/Saigon", "Asia/Ho_Chi_Minh"]);

function utcOffsetHoursForTimezone(timezone: string): number {
  if (VIETNAM_TZ_ALIASES.has(timezone)) return 7;
  return 7;
}

/** UTC epoch for ceremony start (same +7 convention as googleCalendarUrl). */
export function ceremonyTargetMs(
  isoDate: string,
  startTime: string,
  timezone: string,
): number {
  const [sh, sm = 0] = startTime.split(":").map(Number);
  const d = parseWeddingDate(isoDate);
  const offset = utcOffsetHoursForTimezone(timezone);
  return Date.UTC(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    sh - offset,
    sm,
    0,
    0,
  );
}

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function splitCountdown(remainingMs: number): CountdownParts {
  const ms = Math.max(0, remainingMs);
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export function padCountdownUnit(n: number): string {
  return String(n).padStart(2, "0");
}

export function googleCalendarUrl(config: {
  title: string;
  isoDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  details: string;
  location: string;
}): string {
  const [sh, sm] = config.startTime.split(":").map(Number);
  const [eh, em] = config.endTime.split(":").map(Number);
  const d = parseWeddingDate(config.isoDate);
  const start = new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), sh - 7, sm),
  );
  const end = new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), eh - 7, em),
  );
  const fmt = (dt: Date) =>
    dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: config.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    ctz: config.timezone.replace("Asia/Saigon", "Asia/Ho_Chi_Minh"),
    details: config.details,
    location: config.location,
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export function mapsDirectionsUrl(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function mapsEmbedUrl(address: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&hl=vi&z=15&output=embed`;
}
