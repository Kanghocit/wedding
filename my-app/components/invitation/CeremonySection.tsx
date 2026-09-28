import type { PublicWeddingConfig } from "@/lib/config";
import { headingClassName, type as typeTokens } from "@/lib/theme";
import { DateDisplay } from "./DateDisplay";

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
  | "groomTitle"
  | "brideTitle"
  | "ceremonyHeader"
  | "weddingDate"
  | "ceremonyTime"
>;

export function CeremonySection(config: Props) {
  return (
    <>
      <h2 className={headingClassName()}>THÔNG TIN LỄ CƯỚI</h2>

      <div className={`grid md:grid-cols-2 gap-10 md:gap-12 text-center ${typeTokens.bodySerif}`}>
        <div>
          <p className={`${typeTokens.caption} mb-3`}>Ông Bà</p>
          <p>{config.groomFather}</p>
          <p>{config.groomMother}</p>
          <p className="mt-3 text-xs opacity-80 leading-relaxed px-2">{config.groomAddress}</p>
        </div>
        <div>
          <p className={`${typeTokens.caption} mb-3`}>Ông Bà</p>
          <p>{config.brideFather}</p>
          <p>{config.brideMother}</p>
          <p className="mt-3 text-xs opacity-80 leading-relaxed px-2">{config.brideAddress}</p>
        </div>
      </div>

      <div className="text-center space-y-3 md:space-y-4">
        <p className={typeTokens.caption}>TRÂN TRỌNG BÁO TIN</p>
        <p className={`${typeTokens.caption} tracking-[0.15em]`}>
          LỄ THÀNH HÔN CỦA CON CHÚNG TÔI
        </p>
        <h3
          className={`${typeTokens.ceremonyName} font-[family-name:var(--font-garamond)] text-[#404A1D]`}
        >
          {config.groomFullName}
        </h3>
        <p className={typeTokens.caption}>{config.groomTitle}</p>
        <p
          className="font-[family-name:var(--font-nautigal)] text-[#404A1D]"
          style={{ fontSize: typeTokens.scriptAmp, lineHeight: 1.2 }}
        >
          &
        </p>
        <h3
          className={`${typeTokens.ceremonyName} font-[family-name:var(--font-garamond)] text-[#404A1D]`}
        >
          {config.brideFullName}
        </h3>
        <p className={typeTokens.caption}>{config.brideTitle}</p>
        <p className={`${typeTokens.sectionSubheading} normal-case tracking-[0.12em] whitespace-pre-line pt-4 leading-relaxed`}>
          {config.ceremonyHeader}
        </p>
        <DateDisplay isoDate={config.weddingDate} time={config.ceremonyTime} />
      </div>
    </>
  );
}
