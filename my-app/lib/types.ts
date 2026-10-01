export type BankAccount = {
  role: "groom" | "bride";
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
};

export type TimelineItem = {
  time: string;
  label: string;
};

export type PreEventInfo = {
  date: string;
  time: string;
  title: string;
  subtitle: string;
  place: string;
  address: string;
};

export type SeedWish = {
  name: string;
  message: string;
  timestamp?: string;
};

export type RsvpEntry = {
  id: string;
  name: string;
  attending: boolean;
  createdAt: string;
};

export type WishEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export type GuestSalutation =
  | "anh"
  | "chi"
  | "ong"
  | "ba"
  | "co"
  | "chu"
  | "em"
  | "ban";

export type GuestInvite = {
  id: string;
  slug: string;
  name: string;
  salutation: GuestSalutation;
  createdAt: string;
  updatedAt: string;
};

export type WeddingConfig = {
  pageTitle: string;
  groomShortName: string;
  brideShortName: string;
  groomFullName: string;
  brideFullName: string;
  groomFather: string;
  groomMother: string;
  brideFather: string;
  brideMother: string;
  groomAddress: string;
  brideAddress: string;
  ceremonyHeader: string;
  ceremonyPlace: string;
  /** Lễ Chủ nhật — nhà gái / mặc định trang chủ */
  ceremonyTime: string;
  /** Lễ Chủ nhật — nhà trai */
  groomCeremonyTime: string;
  partyTime: string;
  guestReceptionTime: string;
  /** @deprecated use groomPartyAddress / bridePartyAddress */
  partyAddress: string;
  groomPartyAddress: string;
  bridePartyAddress: string;
  groomPartyLabel: string;
  bridePartyLabel: string;
  bridePreEvent: PreEventInfo | null;
  groomPreEvent: PreEventInfo | null;
  weddingDate: string;
  timezone: string;
  dressCodeLabel: string;
  footerMessage: string;
  musicUrl: string;
  adminPassword: string;
  galleryUrls: string[];
  dressColors: string[];
  timeline: TimelineItem[];
  banks: BankAccount[];
  seedWishes: SeedWish[];
  wishSuggestions: string[];
};
