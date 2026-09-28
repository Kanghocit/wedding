"use client";

import { useState } from "react";
import type { RsvpEntry, WishEntry } from "@/lib/types";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rsvps, setRsvps] = useState<RsvpEntry[] | null>(null);
  const [wishes, setWishes] = useState<WishEntry[] | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Sai mật khẩu");
        setRsvps(null);
        setWishes(null);
        return;
      }
      const data = (await res.json()) as {
        rsvps: RsvpEntry[];
        wishes: WishEntry[];
      };
      setRsvps(data.rsvps);
      setWishes(data.wishes);
    } finally {
      setLoading(false);
    }
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
