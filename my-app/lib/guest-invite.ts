import type { GuestInvite, GuestSalutation } from "./types";

export const SALUTATION_LABELS: Record<GuestSalutation, string> = {
  anh: "Anh",
  chi: "Chị",
  ong: "Ông",
  ba: "Bà",
  co: "Cô",
  chu: "Chú",
  em: "Em",
  ban: "Bạn",
};

export const GUEST_SALUTATIONS = Object.keys(
  SALUTATION_LABELS,
) as GuestSalutation[];

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidGuestSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}

export function formatInviteLine(
  name: string,
  salutation: GuestSalutation,
): string {
  const trimmed = name.trim();
  const prefix = SALUTATION_LABELS[salutation];
  if (!trimmed) return `Kính mời ${prefix}`;
  return `${prefix} ${trimmed}`;
}

/** Client-safe: format from a full GuestInvite record. */
export function inviteLineFromGuest(guest: GuestInvite): string {
  return formatInviteLine(guest.name, guest.salutation);
}

const VI_MAP: Record<string, string> = {
  à: "a",
  á: "a",
  ả: "a",
  ã: "a",
  ạ: "a",
  ă: "a",
  ằ: "a",
  ắ: "a",
  ẳ: "a",
  ẵ: "a",
  ặ: "a",
  â: "a",
  ầ: "a",
  ấ: "a",
  ẩ: "a",
  ẫ: "a",
  ậ: "a",
  è: "e",
  é: "e",
  ẻ: "e",
  ẽ: "e",
  ẹ: "e",
  ê: "e",
  ề: "e",
  ế: "e",
  ể: "e",
  ễ: "e",
  ệ: "e",
  ì: "i",
  í: "i",
  ỉ: "i",
  ĩ: "i",
  ị: "i",
  ò: "o",
  ó: "o",
  ỏ: "o",
  õ: "o",
  ọ: "o",
  ô: "o",
  ồ: "o",
  ố: "o",
  ổ: "o",
  ỗ: "o",
  ộ: "o",
  ơ: "o",
  ờ: "o",
  ớ: "o",
  ở: "o",
  ỡ: "o",
  ợ: "o",
  ù: "u",
  ú: "u",
  ủ: "u",
  ũ: "u",
  ụ: "u",
  ư: "u",
  ừ: "u",
  ứ: "u",
  ử: "u",
  ữ: "u",
  ự: "u",
  ỳ: "y",
  ý: "y",
  ỷ: "y",
  ỹ: "y",
  ỵ: "y",
  đ: "d",
};

/** Suggest URL slug from display name (works in browser and Node). */
export function slugifyName(name: string): string {
  let s = name.trim().toLowerCase();
  s = s
    .split("")
    .map((c) => VI_MAP[c] ?? c)
    .join("");
  s = s.replace(/[^a-z0-9\s-]/g, "");
  s = s.replace(/\s+/g, "-").replace(/-+/g, "-");
  return s.replace(/^-|-$/g, "");
}
