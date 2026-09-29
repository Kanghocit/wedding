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
    galleryUrls: splitList(
      env(
        "GALLERY_URLS",
        "https://assets.chungdoi.com/photo-library/design/868ddb966956a9be3daceb4c5069c63402923a0db8fa90efda87fa0ddc8d417c.webp,https://assets.chungdoi.com/photo-library/design/f4d501ac194bc87673a0260b53672083714f26a6807acdd15a0819cc80df2c3f.webp,https://assets.chungdoi.com/photo-library/design/96a6b4bc3f9ba466dfcdd56b966b708dc43ea3e1743e7922185d6024a36cdef5.webp,https://assets.chungdoi.com/photo-library/design/932d1cc8e900f348e154b162746ab5aef56c93670464ca81b4c93f1e53bb87fa.webp,https://assets.chungdoi.com/photo-library/design/e675b91cf8fa3f9a97fe0dcc10cc51e61bdfd8491cbf9813e0dbe43413921993.webp,https://assets.chungdoi.com/photo-library/design/b9a8c9056bad5f8b1d62e0a86b2b1a97d6a5f14c70f7c1c3c4ad9c99edcda787.webp,https://assets.chungdoi.com/photo-library/design/a7d86e0a5cb47687efe046d667e6eedc0bce793c6d7a59f8c9385393bf30aa2a.webp,https://assets.chungdoi.com/photo-library/design/65cc988c7cef94f66d9b5fff4cd1f92333d2b5c08acdd9c10e1cc7b5cd513620.webp,https://assets.chungdoi.com/photo-library/design/5aceecdb76ac0b4e2d0b2a41a26a760cb29676a3edec0b5e79e688d2d9991f06.webp",
      ),
      ",",
    ),
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
