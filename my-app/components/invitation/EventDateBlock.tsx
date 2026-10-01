import { SCROLL_REVEAL_STAGGER_MS } from "@/lib/scroll-reveal-timing";
import { type } from "@/lib/theme";
import { DateDisplay } from "./DateDisplay";
import { ScrollReveal } from "./ScrollReveal";

type Props = {
  subtitle?: string;
  title: string;
  isoDate: string;
  time: string;
  place: string;
  address: string;
  className?: string;
  /** Base delay for first line (ms), each following line + lineStepMs */
  revealStartDelayMs?: number;
  lineStepMs?: number;
};

export function EventDateBlock({
  subtitle,
  title,
  isoDate,
  time,
  place,
  address,
  className = "",
  revealStartDelayMs = 0,
  lineStepMs = SCROLL_REVEAL_STAGGER_MS,
}: Props) {
  let step = 0;
  const delay = () => revealStartDelayMs + step++ * lineStepMs;

  return (
    <div className={`space-y-3 md:space-y-4 ${className}`}>
      {subtitle ? (
        <ScrollReveal as="p" delayMs={delay()} className={`${type.caption} tracking-[0.12em] px-2`}>
          {subtitle}
        </ScrollReveal>
      ) : null}
      <ScrollReveal
        as="p"
        delayMs={delay()}
        className={`${type.sectionSubheading} normal-case tracking-[0.12em] whitespace-pre-line leading-relaxed`}
      >
        {title}
      </ScrollReveal>
      <ScrollReveal delayMs={delay()}>
        <DateDisplay isoDate={isoDate} time={time} />
      </ScrollReveal>
      <div className={`${type.bodySerif} space-y-1 px-2`}>
        <ScrollReveal as="p" delayMs={delay()} className="tracking-[0.08em]">
          {place}
        </ScrollReveal>
        <ScrollReveal
          as="p"
          delayMs={delay()}
          className={`leading-relaxed ${type.addressSerif}`}
        >
          {address}
        </ScrollReveal>
      </div>
    </div>
  );
}
