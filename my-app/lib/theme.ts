/** Visual tokens aligned with Chung Đôi Mai Lan Trắng demo (390 / 768 / 900px). */

export const colors = {
  olive: "#404A1D",
  cream: "#FFFAF7",
  creamRgb: "rgb(255, 250, 247)",
  borderSoft: "#404A1D22",
  borderMedium: "#404A1D33",
  modalSubmit: "#6b7560",
} as const;

export const layout = {
  containerMax: "max-w-[480px] md:max-w-[900px]",
  sectionGap: "gap-16 md:gap-20",
  sectionPadX: "px-3 md:px-6",
  sectionPadWide: "px-6 md:px-10",
  floralW: "w-[260px] md:w-[520px] lg:w-[585px]",
} as const;

const garamond = "font-[family-name:var(--font-garamond)]";
const baskerville = "font-[family-name:var(--font-baskerville)]";
const montserrat = "font-[family-name:var(--font-montserrat)]";
const script = "font-[family-name:var(--font-script)]";

export const type = {
  heading: "uppercase font-normal text-center tracking-[0.05em] text-[20px] md:text-[26px]",
  heroSubtitle:
    "text-[clamp(12px,3.1vw,16px)] tracking-[0.22em] md:tracking-[0.25em] leading-[1.55] opacity-80 whitespace-pre-line",
  heroScriptName:
    "text-[clamp(2.35rem,10vw,3rem)] md:text-[min(120px,28vw)]",
  heroScriptAmp:
    "text-[clamp(1.5rem,6.2vw,2rem)] md:text-[min(86px,20vw)]",
  scriptName: "min(120px, 28vw)",
  scriptAmp: "min(86px, 20vw)",
  ceremonyName: "text-[clamp(2.25rem,10vw,4rem)] md:text-[64px] leading-[1.1]",
  bodyUi: montserrat,
  cover: {
    name: `${script} text-[1.75rem] md:text-[2rem] leading-tight font-normal text-[#404A1D]`,
    amp: `${script} text-2xl md:text-[1.75rem] text-[#404A1D]/75 leading-none`,
    date: `${garamond} text-[15px] md:text-base text-[#404A1D]/85`,
    invite: `${garamond} text-sm md:text-[15px] text-[#404A1D]/70 italic`,
    button: `${montserrat} text-sm font-medium tracking-[0.08em]`,
  },
  sectionSubheading: `${baskerville} text-xs md:text-base tracking-[0.08em] uppercase text-[#404A1D]`,
  caption: `${montserrat} text-xs md:text-[13px] font-light tracking-[0.2em]`,
  bodySerif: `${garamond} text-[15px] md:text-base text-[#404A1D]`,
  addressSerif: `${garamond} text-sm md:text-base text-[#404A1D]/80`,
  footerNote: `${montserrat} text-xs md:text-sm text-center opacity-80 leading-relaxed`,
  hintLink: `${montserrat} text-sm font-medium tracking-[0.12em]`,
  galleryCounter: `${montserrat} text-sm font-light text-[#404A1D]/70`,
  giftHint: `${montserrat} text-xs tracking-[0.22em] opacity-70`,
  timelineTime: `${garamond} text-[15px] md:text-base tabular-nums text-[#404A1D]`,
  timelineLabel: `${garamond} text-[15px] md:text-base text-[#404A1D]/90 leading-snug`,
} as const;

export function headingClassName() {
  return `${type.heading} ${baskerville} text-[#404A1D]`;
}

export function modalHeadingClassName() {
  return `${type.heading} ${baskerville} !text-white text-[20px] md:text-[26px]`;
}
