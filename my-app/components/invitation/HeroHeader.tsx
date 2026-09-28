import Image from "next/image";
import { type } from "@/lib/theme";

type Props = {
  groomShort: string;
  brideShort: string;
};

export function HeroHeader({ groomShort, brideShort }: Props) {
  return (
    <header className="relative flex w-full justify-center min-h-[100dvh] md:min-h-0 pt-12 pb-8 md:pt-24 md:pb-12">
      <div className="relative mx-auto flex w-full max-w-[480px] flex-col justify-end md:justify-start md:w-[70%] md:max-w-none md:ml-[1vw] md:mr-0 px-3 md:px-0">
        <div className="relative mx-auto w-[min(92%,21rem)] md:w-full">
          <Image
            src="/themes/khung-hoa.webp"
            alt=""
            width={1200}
            height={2120}
            className="block h-auto w-full"
            priority
          />
          <div
            className="absolute inset-x-0 top-[9%] bottom-[34%] flex flex-col items-center justify-center text-center md:bottom-auto md:top-[13.5%] md:block md:-translate-x-[1vw] md:h-auto"
            style={{ color: "#404A1D" }}
          >
            <div
              className={`flex flex-col items-center gap-0 text-center font-[family-name:var(--font-baskerville)] md:-translate-y-[40px] ${type.heroSubtitle}`}
            >
              THE{"\n"}WEDDING{"\n"}OF
            </div>
            <div className="mt-[4%] flex w-full flex-col items-center text-center font-[family-name:var(--font-script)] text-[#404A1D] md:-translate-y-[40px]">
              <div className="flex w-[92%] justify-center md:w-[80%]">
                <span
                  className={`whitespace-nowrap leading-[1.28] ${type.heroScriptName}`}
                >
                  {groomShort}
                </span>
              </div>
              <div className={`my-0.5 leading-[1.15] ${type.heroScriptAmp}`}>
                &
              </div>
              <div className="flex w-[92%] justify-center md:w-[80%]">
                <span
                  className={`whitespace-nowrap leading-[1.28] ${type.heroScriptName}`}
                >
                  {brideShort}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
