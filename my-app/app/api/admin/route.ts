import { NextResponse } from "next/server";
import { getWeddingConfig } from "@/lib/config";
import { listRsvps, listWishes } from "@/lib/data";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  const { adminPassword } = getWeddingConfig();
  if (!body.password || body.password !== adminPassword) {
    return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
  }
  const [rsvps, wishes] = await Promise.all([listRsvps(), listWishes()]);
  return NextResponse.json({ rsvps, wishes });
}
