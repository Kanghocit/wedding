import { NextResponse } from "next/server";
import { addWish, listWishes } from "@/lib/data";

export async function GET() {
  const wishes = await listWishes();
  return NextResponse.json({ wishes });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; message?: string };
    const name = body.name?.trim();
    const message = body.message?.trim();
    if (!name || !message) {
      return NextResponse.json(
        { error: "Tên và lời chúc là bắt buộc" },
        { status: 400 },
      );
    }
    const entry = await addWish(name, message);
    return NextResponse.json({ ok: true, entry });
  } catch {
    return NextResponse.json({ error: "Không gửi được lời chúc" }, { status: 500 });
  }
}
