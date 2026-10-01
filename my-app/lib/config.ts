import { defaultGalleryUrlsList } from "./gallery-images";
import type {
  BankAccount,
  PreEventInfo,
  SeedWish,
  TimelineItem,
  WeddingConfig,
} from "./types";

function env(key: string, fallback = ""): string {
  return process.env[key]?.trim() ?? fallback;
}

function splitList(raw: string, sep: string): string[] {
  return raw
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseTimeline(raw: string): TimelineItem[] {
  return splitList(raw, ";").map((chunk) => {
    const [time, ...rest] = chunk.split("|");
    return { time: time.trim(), label: rest.join("|").trim() };
  });
}

function parseBanks(raw: string): BankAccount[] {
  return splitList(raw, ";").map((chunk) => {
    const [role, bankName, bankCode, accountNumber, accountName] =
      chunk.split("|");
    return {
      role: role.trim() as "groom" | "bride",
      bankName: bankName.trim(),
      bankCode: bankCode.trim(),
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
    };
  });
}

function parseWishPairs(raw: string): SeedWish[] {
  return splitList(raw, ";").map((chunk) => {
    const pipe = chunk.indexOf("|");
    if (pipe === -1) return { name: "Khách", message: chunk };
    return {
      name: chunk.slice(0, pipe).trim(),
      message: chunk.slice(pipe + 1).trim(),
    };
  });
}

function parseSuggestions(raw: string): string[] {
  return splitList(raw, ";");
}

export function vietQrImageUrl(bankCode: string, accountNumber: string): string {
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?accountName=${encodeURIComponent("")}`;
}

function parsePreEvent(
  prefix: "BRIDE" | "GROOM",
  fallbackAddress: string,
): PreEventInfo | null {
  const date = env(`${prefix}_PRE_EVENT_DATE`);
  if (!date) return null;

  const address = env(`${prefix}_PRE_EVENT_ADDRESS`) || fallbackAddress;

  return {
    date,
    time: env(`${prefix}_PRE_EVENT_TIME`, "16:30"),
    title: env(`${prefix}_PRE_EVENT_TITLE`, "BỮA CƠM THÂN MẬT"),
    subtitle: env(
      `${prefix}_PRE_EVENT_SUBTITLE`,
      "TỚI DỰ BỮA CƠM THÂN MẬT MỪNG LỄ VU QUY",
    ),
    place: env(
      `${prefix}_PRE_EVENT_PLACE`,
      prefix === "GROOM" ? "GIA ĐÌNH NHÀ TRAI" : "GIA ĐÌNH NHÀ GÁI",
    ),
    address,
  };
}

export type PartySideForPreEvent = "groom" | "bride" | undefined;

export function resolvePreEvent(
  config: Pick<WeddingConfig, "bridePreEvent" | "groomPreEvent">,
  partySide?: PartySideForPreEvent,
): PreEventInfo | null {
  if (partySide === "groom") return config.groomPreEvent;
  if (partySide === "bride") return config.bridePreEvent;
  return config.bridePreEvent ?? config.groomPreEvent;
}

export function resolveCeremonyTime(
  config: Pick<WeddingConfig, "ceremonyTime" | "groomCeremonyTime">,
  partySide?: PartySideForPreEvent,
): string {
  if (partySide === "groom") return config.groomCeremonyTime;
  return config.ceremonyTime;
}

export function getWeddingConfig(): WeddingConfig {
  return {
    pageTitle: env("PAGE_TITLE", "Thiệp Cưới Mai Lan Trắng"),
    groomShortName: env("GROOM_SHORT_NAME", "Văn Long"),
    brideShortName: env("BRIDE_SHORT_NAME", "Thu Hà"),
    groomFullName: env("GROOM_FULL_NAME", "Hoàng Văn Long"),
    brideFullName: env("BRIDE_FULL_NAME", "Nguyễn Thị Thu Hà"),
    groomFather: env("GROOM_FATHER", "Hoàng Văn Minh"),
    groomMother: env("GROOM_MOTHER", "Bùi Thị Lan"),
    brideFather: env("BRIDE_FATHER", "Nguyễn Văn Cường"),
    brideMother: env("BRIDE_MOTHER", "Trần Thị Yến"),
    groomAddress: env(
      "GROOM_ADDRESS",
      "25 Lê Lợi, Minh Khai, Hồng Bàng, Hải Phòng",
    ),
    brideAddress: env(
      "BRIDE_ADDRESS",
      "78 Điện Biên Phủ, Đằng Giang, Ngô Quyền, Hải Phòng",
    ),
    ceremonyHeader: env(
      "CEREMONY_HEADER",
      "LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI\nTƯ GIA",
    ).replace(/\\n/g, "\n"),
    ceremonyPlace: env("CEREMONY_PLACE", "TƯ GIA"),
    ceremonyTime: env("CEREMONY_TIME", "12:00"),
    groomCeremonyTime: env("GROOM_CEREMONY_TIME", "12:30"),
    partyTime: env("PARTY_TIME", "11:00"),
    guestReceptionTime: env("GUEST_RECEPTION_TIME", "10:30"),
    partyAddress: env(
      "PARTY_ADDRESS",
      "Trung tâm tiệc cưới Gia Viên, 2B Bạch Đằng, Hồng Bàng, Hải Phòng",
    ),
    groomPartyAddress: env(
      "GROOM_PARTY_ADDRESS",
      env(
        "PARTY_ADDRESS",
        "Trung tâm tiệc cưới Gia Viên, 2B Bạch Đằng, Hồng Bàng, Hải Phòng",
      ),
    ),
    bridePartyAddress: env(
      "BRIDE_PARTY_ADDRESS",
      env(
        "BRIDE_ADDRESS",
        "78 Điện Biên Phủ, Đằng Giang, Ngô Quyền, Hải Phòng",
      ),
    ),
    groomPartyLabel: env("GROOM_PARTY_LABEL", "Nhà trai"),
    bridePartyLabel: env("BRIDE_PARTY_LABEL", "Nhà gái"),
    bridePreEvent: parsePreEvent("BRIDE", env("BRIDE_ADDRESS", "")),
    groomPreEvent: parsePreEvent("GROOM", env("GROOM_ADDRESS", "")),
    weddingDate: env("WEDDING_DATE", "2026-04-26"),
    timezone: env("TIMEZONE", "Asia/Saigon"),
    dressCodeLabel: env("DRESS_CODE_LABEL", "Trang phục dự tiệc"),
    footerMessage: env(
      "FOOTER_MESSAGE",
      "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!",
    ),
    musicUrl: env("MUSIC_URL", "/music/le-duong.mp3"),
    adminPassword: env("ADMIN_PASSWORD", "changeme"),
    galleryUrls: (() => {
      const raw = env("GALLERY_URLS", "");
      if (!raw) return defaultGalleryUrlsList();
      return splitList(raw, ",");
    })(),
    dressColors: splitList(env("DRESS_COLORS", "#3a332c,#b9a48a,#f6f1e8"), ","),
    timeline: parseTimeline(
      env(
        "TIMELINE",
        "17:30|Đón khách;18:30|Khai tiệc;18:45|Rót rượu, cắt bánh;19:00|Phục vụ món chính;21:00|Kết thúc tiệc",
      ),
    ),
    banks: parseBanks(
      env(
        "BANKS",
        "groom|Vietcombank|VCB|0000000000|THIEP CUOI DEMO;bride|BIDV|BIDV|8787867778|Nguyễn Thị Thu Hà",
      ),
    ),
    seedWishes: parseWishPairs(
      env(
        "SEED_WISHES",
        "HUy|Mong rằng tình yêu của hai bạn là nguồn sức mạnh vượt qua mọi thử thách.;Tú Cầu Lông|Về chung một nhà, cùng nhau già đi nhé;Tuấn đội bóng|Chúc tổ ấm mới ngập tràn niềm vui và tiếng cười;Bạn Tuấn Mạnh|Mừng ngày trọng đại! Chúc hai bạn cười nhiều hơn cãi, yêu nhiều hơn giận nhen!;Anh Hùng|Chúc hai em trăm năm hạnh phúc, vợ chồng đồng lòng <3;Cô Phương|Chúc vợ chồng son mãi yêu thương, sớm có tin vui :D",
      ),
    ),
    wishSuggestions: parseSuggestions(
      env(
        "WISH_SUGGESTIONS",
        "Chúc hai bạn trăm năm hạnh phúc!;Mừng ngày trọng đại, chúc vợ chồng son mãi yêu thương.;Về chung một nhà, cùng nhau già đi nhé!",
      ),
    ),
  };
}

/** Safe subset for client components (no admin password). */
export type PublicWeddingConfig = Omit<WeddingConfig, "adminPassword">;

export function getPublicWeddingConfig(): PublicWeddingConfig {
  const { adminPassword: _, ...rest } = getWeddingConfig();
  return rest;
}
