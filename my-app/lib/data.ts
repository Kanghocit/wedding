import { promises as fs } from "fs";
import path from "path";
import type { RsvpEntry, WishEntry } from "./types";
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
