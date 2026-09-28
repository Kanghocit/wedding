import { NextResponse } from "next/server";
import { addRsvp } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      attending?: boolean;
    };
    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "Tên là bắt buộc" }, { status: 400 });
    }
    if (typeof body.attending !== "boolean") {
      return NextResponse.json(
        { error: "Vui lòng chọn tham dự hay không" },
        { status: 400 },
      );
    }
    const entry = await addRsvp(name, body.attending);
    return NextResponse.json({ ok: true, entry });
  } catch {
    return NextResponse.json({ error: "Không gửi được xác nhận" }, { status: 500 });
  }
}
