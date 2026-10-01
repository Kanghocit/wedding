"use client";

import Image from "next/image";

const IMAGE_SRC = "/images/img-main.JPG";

type Props = {
  message: string;
};

export function ThankYouPhotoSection({ message }: Props) {
  return (
    <footer
      aria-label="Lời cảm ơn"
      className="relative z-10 w-full overflow-hidden pb-16 md:pb-20"
    >
      <div
        className="relative mx-auto w-full max-w-none md:-mx-6 md:w-[calc(100%+3rem)]"
        style={{ height: "min(85vh, 640px)" }}
      >
        <Image
          src={IMAGE_SRC}
          alt="Cảm ơn quý khách đã đến chung vui"
          fill
          className="object-cover object-[center_35%] brightness-[1.08] saturate-[0.92]"
          sizes="(max-width: 900px) 100vw, 900px"
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/75 via-white/55 to-white/70"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 0%, transparent 45%), radial-gradient(circle at 80% 70%, white 0%, transparent 40%)",
          }}
          aria-hidden
        />

        <div className="absolute inset-x-0 top-[48%] z-10 flex min-h-[38%] flex-col items-center justify-center bg-black/45 px-6 py-10 text-center backdrop-blur-[1px] md:top-[46%] md:min-h-[36%]">
          <p className="font-[family-name:var(--font-script)] text-[clamp(2.75rem,14vw,4.5rem)] leading-none text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            thankyou
          </p>
          <p className="mt-4 max-w-[20rem] font-[family-name:var(--font-garamond)] text-[15px] italic leading-snug text-white/95 md:text-base">
            {message}
          </p>
        </div>
      </div>
    </footer>
  );
}
