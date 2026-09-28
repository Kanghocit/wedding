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

export type WeddingConfig = {
  pageTitle: string;
  groomShortName: string;
  brideShortName: string;
  groomFullName: string;
  brideFullName: string;
  groomTitle: string;
  brideTitle: string;
  groomFather: string;
  groomMother: string;
  brideFather: string;
  brideMother: string;
  groomAddress: string;
  brideAddress: string;
  ceremonyHeader: string;
  ceremonyPlace: string;
  ceremonyTime: string;
  partyTime: string;
  guestReceptionTime: string;
  /** @deprecated use groomPartyAddress / bridePartyAddress */
  partyAddress: string;
  groomPartyAddress: string;
  bridePartyAddress: string;
  groomPartyLabel: string;
  bridePartyLabel: string;
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
