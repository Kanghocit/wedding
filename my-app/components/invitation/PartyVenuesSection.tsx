"use client";

import { mapsDirectionsUrl, mapsEmbedUrl } from "@/lib/date-utils";
import { headingClassName, layout, type } from "@/lib/theme";

type Venue = {
  label: string;
  address: string;
};

type Props = {
  groom: Venue;
  bride: Venue;
};

function VenueBlock({ label, address }: Venue) {
  return (
    <article className="w-full max-w-lg mx-auto text-center">
      <p className={`${type.caption} uppercase text-[#404A1D]/70 mb-3`}>
        {label}
      </p>
      <p className={`${type.bodySerif} leading-relaxed px-2`}>
        {address}
      </p>
      <div className="mx-auto mt-4 mb-5 h-px w-full max-w-md bg-[#404A1D]/15" aria-hidden />

      <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#404A1D]/12 shadow-[0_8px_28px_rgba(64,74,29,0.08)] aspect-[4/3] md:aspect-[16/11] bg-[#404A1D]/5">
        <iframe
          title={`Bản đồ ${label}`}
          src={mapsEmbedUrl(address)}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <a
        href={mapsDirectionsUrl(address)}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-5 ${type.hintLink} inline-flex items-center justify-center rounded-full border border-[#404A1D33] px-8 py-2.5 hover:bg-[#404A1D0d]`}
      >
        Chỉ đường
      </a>
    </article>
  );
}

export function PartyVenuesSection({ groom, bride }: Props) {
  return (
    <section
      className={`relative flex flex-col gap-10 md:gap-14 ${layout.sectionPadWide} pb-12 md:pb-16 z-10 text-center`}
    >
      <h3 className={`${headingClassName()} leading-snug`}>
        TIỆC CƯỚI SẼ TỔ CHỨC TẠI
      </h3>

      <VenueBlock {...groom} />
      <VenueBlock {...bride} />
    </section>
  );
}
