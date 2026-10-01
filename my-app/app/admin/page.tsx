"use client";

import { useCallback, useState } from "react";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import {
  GUEST_SALUTATIONS,
  SALUTATION_LABELS,
  slugifyName,
} from "@/lib/guest-invite";
import type { GuestInvite, GuestSalutation, RsvpEntry, WishEntry } from "@/lib/types";

type GuestFormState = {
  id?: string;
  name: string;
  salutation: GuestSalutation;
  slug: string;
};

const emptyGuestForm = (): GuestFormState => ({
  name: "",
  salutation: "anh",
  slug: "",
});

function brideInviteUrl(slug: string): string {
  const base =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL?.trim()
      ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
      : typeof window !== "undefined"
        ? window.location.origin
        : "";
  return `${base}/bride?invite=${encodeURIComponent(slug)}`;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rsvps, setRsvps] = useState<RsvpEntry[] | null>(null);
  const [wishes, setWishes] = useState<WishEntry[] | null>(null);
  const [guests, setGuests] = useState<GuestInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [guestForm, setGuestForm] = useState<GuestFormState>(emptyGuestForm);
  const [guestError, setGuestError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const adminFetch = useCallback(
    async (body: Record<string, unknown>) => {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...body }),
      });
      const data = (await res.json()) as {
        error?: string;
        rsvps?: RsvpEntry[];
        wishes?: WishEntry[];
        guests?: GuestInvite[];
      };
      if (!res.ok) {
        throw new Error(data.error ?? "Lỗi máy chủ");
      }
      return data;
    },
    [password],
  );

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch({});
      setRsvps(data.rsvps ?? []);
      setWishes(data.wishes ?? []);
      setGuests(data.guests ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sai mật khẩu");
      setRsvps(null);
      setWishes(null);
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  const resetGuestForm = () => {
    setGuestForm(emptyGuestForm());
    setSlugTouched(false);
    setGuestError("");
  };

  const startEditGuest = (g: GuestInvite) => {
    setGuestForm({
      id: g.id,
      name: g.name,
      salutation: g.salutation,
      slug: g.slug,
    });
    setSlugTouched(true);
    setGuestError("");
  };

  const saveGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuestError("");
    setLoading(true);
    try {
      const action = guestForm.id ? "updateGuest" : "createGuest";
      const payload: Record<string, unknown> = {
        action,
        name: guestForm.name,
        salutation: guestForm.salutation,
        slug: guestForm.slug,
      };
      if (guestForm.id) payload.id = guestForm.id;
      const data = await adminFetch(payload);
      setGuests(data.guests ?? []);
      resetGuestForm();
    } catch (err) {
      setGuestError(err instanceof Error ? err.message : "Không lưu được");
    } finally {
      setLoading(false);
    }
  };

  const removeGuest = async (id: string) => {
    if (!confirm("Xóa khách mời này? Link cũ sẽ không còn hiệu lực.")) return;
    setLoading(true);
    setGuestError("");
    try {
      const data = await adminFetch({ action: "deleteGuest", id });
      setGuests(data.guests ?? []);
      if (guestForm.id === id) resetGuestForm();
    } catch (err) {
      setGuestError(err instanceof Error ? err.message : "Không xóa được");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async (slug: string) => {
    const url = brideInviteUrl(slug);
    const ok = await copyToClipboard(url);
    setCopyHint(ok ? "Đã copy link!" : "Không copy được — hãy copy tay");
    window.setTimeout(() => setCopyHint(null), 2000);
  };

  return (
    <main className="min-h-screen bg-[#FFFAF7] text-[#404A1D] p-6 md:p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Quản lý thiệp cưới</h1>
      {!rsvps ? (
        <form onSubmit={login} className="space-y-4 max-w-sm">
          <label className="block text-sm">
            Mật khẩu admin
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#404A1D33] px-3 py-2"
            />
          </label>
          {error ? <p className="text-red-600 text-sm">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#404A1D] text-white px-6 py-2 text-sm disabled:opacity-50"
          >
            {loading ? "Đang kiểm tra…" : "Đăng nhập"}
          </button>
        </form>
      ) : (
        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-medium mb-3">
              Mời cá nhân (nhà gái)
            </h2>
            <p className="text-sm opacity-70 mb-4">
              Tạo link riêng dạng{" "}
              <code className="text-xs bg-white px-1 rounded">/bride?invite=slug</code>
              . Khách sẽ thấy lời mời kèm xưng hô trên bìa thiệp và trong thiệp.
            </p>
            {copyHint ? (
              <p className="text-sm text-green-800 mb-2">{copyHint}</p>
            ) : null}
            {guestError ? (
              <p className="text-sm text-red-600 mb-2">{guestError}</p>
            ) : null}

            <form
              onSubmit={saveGuest}
              className="rounded-lg border border-[#404A1D15] bg-white p-4 space-y-3 mb-6"
            >
              <p className="text-sm font-medium">
                {guestForm.id ? "Sửa khách mời" : "Thêm khách mời"}
              </p>
              <label className="block text-sm">
                Tên hiển thị
                <input
                  value={guestForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setGuestForm((f) => ({
                      ...f,
                      name,
                      slug:
                        !slugTouched && !f.id
                          ? slugifyName(name)
                          : f.slug,
                    }));
                  }}
                  className="mt-1 w-full rounded-lg border border-[#404A1D33] px-3 py-2"
                  placeholder="Nguyễn Văn A"
                />
              </label>
              <label className="block text-sm">
                Xưng hô
                <select
                  value={guestForm.salutation}
                  onChange={(e) =>
                    setGuestForm((f) => ({
                      ...f,
                      salutation: e.target.value as GuestSalutation,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-[#404A1D33] px-3 py-2 bg-white"
                >
                  {GUEST_SALUTATIONS.map((s) => (
                    <option key={s} value={s}>
                      {SALUTATION_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                Slug (tham số invite)
                <input
                  value={guestForm.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setGuestForm((f) => ({
                      ...f,
                      slug: e.target.value.toLowerCase(),
                    }));
                  }}
                  className="mt-1 w-full rounded-lg border border-[#404A1D33] px-3 py-2 font-mono text-sm"
                  placeholder="nguyen-van-a"
                />
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-[#404A1D] text-white px-5 py-2 text-sm disabled:opacity-50"
                >
                  {guestForm.id ? "Cập nhật" : "Thêm"}
                </button>
                {guestForm.id ? (
                  <button
                    type="button"
                    onClick={resetGuestForm}
                    className="rounded-full border border-[#404A1D33] px-5 py-2 text-sm"
                  >
                    Hủy sửa
                  </button>
                ) : null}
              </div>
            </form>

            {guests.length === 0 ? (
              <p className="text-sm opacity-70">Chưa có khách mời riêng.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {guests.map((g) => (
                  <li
                    key={g.id}
                    className="rounded-lg border border-[#404A1D15] bg-white px-3 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {SALUTATION_LABELS[g.salutation]} {g.name}
                      </p>
                      <p className="text-xs opacity-60 font-mono truncate">
                        invite={g.slug}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => void copyLink(g.slug)}
                        className="rounded-full border border-[#404A1D33] px-3 py-1 text-xs"
                      >
                        Copy link
                      </button>
                      <button
                        type="button"
                        onClick={() => startEditGuest(g)}
                        className="rounded-full border border-[#404A1D33] px-3 py-1 text-xs"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeGuest(g.id)}
                        className="rounded-full border border-red-300 text-red-800 px-3 py-1 text-xs"
                      >
                        Xóa
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">
              RSVP ({rsvps.length})
            </h2>
            {rsvps.length === 0 ? (
              <p className="text-sm opacity-70">Chưa có xác nhận.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {rsvps.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-lg border border-[#404A1D15] bg-white px-3 py-2 flex justify-between gap-4"
                  >
                    <span>{r.name}</span>
                    <span className={r.attending ? "text-green-800" : "text-red-800"}>
                      {r.attending ? "Sẽ đến" : "Không đến"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-lg font-medium mb-3">
              Lời chúc gửi mới ({wishes?.filter((w) => !w.id.startsWith("seed-")).length ?? 0})
            </h2>
            <ul className="space-y-2 text-sm">
              {(wishes ?? [])
                .filter((w) => !w.id.startsWith("seed-"))
                .map((w) => (
                  <li
                    key={w.id}
                    className="rounded-lg border border-[#404A1D15] bg-white px-3 py-2"
                  >
                    <p className="font-medium">{w.name}</p>
                    <p className="opacity-80 mt-1">{w.message}</p>
                  </li>
                ))}
            </ul>
          </section>
          <a href="/" className="text-sm underline opacity-70">
            ← Về thiệp
          </a>
        </div>
      )}
    </main>
  );
}
