import { promises as fs } from "fs";
import path from "path";
import { isValidGuestSlug } from "./guest-invite";
import type { GuestInvite, GuestSalutation, RsvpEntry, WishEntry } from "./types";
import { getWeddingConfig } from "./config";

function dataDir(): string {
  return process.env.DATA_DIR?.trim() || path.join(process.cwd(), "data");
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

function rsvpPath() {
  return path.join(dataDir(), "rsvps.json");
}

function wishesPath() {
  return path.join(dataDir(), "wishes.json");
}

function guestsPath() {
  return path.join(dataDir(), "guests.json");
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export async function listRsvps(): Promise<RsvpEntry[]> {
  return readJson<RsvpEntry[]>(rsvpPath(), []);
}

export async function addRsvp(
  name: string,
  attending: boolean,
): Promise<RsvpEntry> {
  const list = await listRsvps();
  const entry: RsvpEntry = {
    id: crypto.randomUUID(),
    name: name.trim(),
    attending,
    createdAt: new Date().toISOString(),
  };
  list.unshift(entry);
  await writeJson(rsvpPath(), list);
  return entry;
}

export async function listWishes(): Promise<WishEntry[]> {
  const stored = await readJson<WishEntry[]>(wishesPath(), []);
  const config = getWeddingConfig();
  const seeded: WishEntry[] = config.seedWishes.map((w, i) => ({
    id: `seed-${i}`,
    name: w.name,
    message: w.message,
    createdAt: w.timestamp ?? new Date(2026, 3, 7, 13, 42, i).toISOString(),
  }));
  return [...stored, ...seeded].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function addWish(name: string, message: string): Promise<WishEntry> {
  const list = await readJson<WishEntry[]>(wishesPath(), []);
  const entry: WishEntry = {
    id: crypto.randomUUID(),
    name: name.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };
  list.unshift(entry);
  await writeJson(wishesPath(), list);
  return entry;
}

export function formatWishTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export async function listGuestInvites(): Promise<GuestInvite[]> {
  const list = await readJson<GuestInvite[]>(guestsPath(), []);
  return list.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getGuestInviteBySlug(
  slug: string,
): Promise<GuestInvite | null> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;
  const list = await readJson<GuestInvite[]>(guestsPath(), []);
  return list.find((g) => g.slug === normalized) ?? null;
}

function assertGuestFields(
  slug: string,
  name: string,
  salutation: GuestSalutation,
): void {
  const s = slug.trim().toLowerCase();
  if (!isValidGuestSlug(s)) {
    throw new Error("Slug không hợp lệ (chỉ a-z, 0-9 và dấu gạch ngang)");
  }
  if (!name.trim()) {
    throw new Error("Tên khách không được để trống");
  }
  const allowed: GuestSalutation[] = [
    "anh",
    "chi",
    "ong",
    "ba",
    "co",
    "chu",
    "em",
    "ban",
  ];
  if (!allowed.includes(salutation)) {
    throw new Error("Xưng hô không hợp lệ");
  }
}

export async function createGuestInvite(input: {
  slug: string;
  name: string;
  salutation: GuestSalutation;
}): Promise<GuestInvite> {
  const slug = input.slug.trim().toLowerCase();
  assertGuestFields(slug, input.name, input.salutation);
  const list = await readJson<GuestInvite[]>(guestsPath(), []);
  if (list.some((g) => g.slug === slug)) {
    throw new Error("Slug đã tồn tại");
  }
  const now = new Date().toISOString();
  const entry: GuestInvite = {
    id: crypto.randomUUID(),
    slug,
    name: input.name.trim(),
    salutation: input.salutation,
    createdAt: now,
    updatedAt: now,
  };
  list.unshift(entry);
  await writeJson(guestsPath(), list);
  return entry;
}

export async function updateGuestInvite(input: {
  id: string;
  slug: string;
  name: string;
  salutation: GuestSalutation;
}): Promise<GuestInvite> {
  const slug = input.slug.trim().toLowerCase();
  assertGuestFields(slug, input.name, input.salutation);
  const list = await readJson<GuestInvite[]>(guestsPath(), []);
  const idx = list.findIndex((g) => g.id === input.id);
  if (idx === -1) {
    throw new Error("Không tìm thấy khách");
  }
  if (list.some((g) => g.slug === slug && g.id !== input.id)) {
    throw new Error("Slug đã tồn tại");
  }
  const updated: GuestInvite = {
    ...list[idx],
    slug,
    name: input.name.trim(),
    salutation: input.salutation,
    updatedAt: new Date().toISOString(),
  };
  list[idx] = updated;
  await writeJson(guestsPath(), list);
  return updated;
}

export async function deleteGuestInvite(id: string): Promise<void> {
  const list = await readJson<GuestInvite[]>(guestsPath(), []);
  const next = list.filter((g) => g.id !== id);
  if (next.length === list.length) {
    throw new Error("Không tìm thấy khách");
  }
  await writeJson(guestsPath(), next);
}
