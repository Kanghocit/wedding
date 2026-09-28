import { type } from "@/lib/theme";
import { DateDisplay } from "./DateDisplay";

type Props = {
  subtitle?: string;
  title: string;
  isoDate: string;
  time: string;
  place: string;
  address: string;
  className?: string;
};

export function EventDateBlock({
  subtitle,
  title,
  isoDate,
  time,
  place,
  address,
  className = "",
}: Props) {
  return (
    <div className={`space-y-3 md:space-y-4 ${className}`}>
      {subtitle ? (
        <p className={`${type.caption} tracking-[0.12em] px-2`}>{subtitle}</p>
      ) : null}
      <p
        className={`${type.sectionSubheading} normal-case tracking-[0.12em] whitespace-pre-line leading-relaxed`}
      >
        {title}
      </p>
      <DateDisplay isoDate={isoDate} time={time} />
      <div className={`${type.bodySerif} space-y-1 px-2`}>
        <p className="tracking-[0.08em]">{place}</p>
        <p className={`leading-relaxed ${type.addressSerif}`}>{address}</p>
      </div>
    </div>
  );
}
