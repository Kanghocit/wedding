import Image from "next/image";
import { type } from "@/lib/theme";

type Props = {
  groomShort: string;
  brideShort: string;
};

export function HeroHeader({ groomShort, brideShort }: Props) {
  return (
    <header className="relative w-full flex justify-center pt-16 pb-8 md:pt-24 md:pb-12">
      <div className="relative w-[70%] ml-[2vw] md:ml-[1vw]">
        <Image
          src="/themes/khung-hoa.webp"
          alt=""
          width={1200}
          height={2120}
          className="w-full h-auto block"
          priority
        />
        <div
          className="absolute left-0 right-0 flex flex-col items-center text-center w-full -translate-x-[2vw] md:-translate-x-[1vw]"
          style={{ color: "#404A1D", top: "12%" }}
        >
          <div
            className={`flex flex-col items-center gap-0 -translate-y-[35px] md:-translate-y-[40px] text-center font-[family-name:var(--font-baskerville)] ${type.heroSubtitle}`}
          >
            THE{"\n"}WEDDING{"\n"}OF
          </div>
          <div className="mt-[4%] w-full flex flex-col items-center text-center -translate-y-[35px] md:-translate-y-[40px] font-[family-name:var(--font-nautigal)] text-[#404A1D]">
            <div className="flex w-[80%] justify-center">
              <span
                className="whitespace-nowrap leading-[1.45]"
                style={{ fontSize: type.scriptName }}
              >
                {groomShort}
              </span>
            </div>
            <div style={{ fontSize: type.scriptAmp, lineHeight: 1.3 }}>&</div>
            <div className="flex w-[80%] justify-center">
              <span
                className="whitespace-nowrap leading-[1.45]"
                style={{ fontSize: type.scriptName }}
              >
                {brideShort}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
