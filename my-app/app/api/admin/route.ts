import { NextResponse } from "next/server";
import { getWeddingConfig } from "@/lib/config";
import {
  createGuestInvite,
  deleteGuestInvite,
  listGuestInvites,
  listRsvps,
  listWishes,
  updateGuestInvite,
} from "@/lib/data";
import type { GuestSalutation } from "@/lib/types";

type AdminBody = {
  password?: string;
  action?: string;
  id?: string;
  slug?: string;
  name?: string;
  salutation?: GuestSalutation;
};

function unauthorized() {
  return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  const body = (await request.json()) as AdminBody;
  const { adminPassword } = getWeddingConfig();
  if (!body.password || body.password !== adminPassword) {
    return unauthorized();
  }

  const action = body.action ?? "login";

  try {
    if (action === "createGuest") {
      if (!body.slug || !body.name || !body.salutation) {
        return badRequest("Thiếu slug, tên hoặc xưng hô");
      }
      const guest = await createGuestInvite({
        slug: body.slug,
        name: body.name,
        salutation: body.salutation,
      });
      const guests = await listGuestInvites();
      return NextResponse.json({ guest, guests });
    }

    if (action === "updateGuest") {
      if (!body.id || !body.slug || !body.name || !body.salutation) {
        return badRequest("Thiếu id, slug, tên hoặc xưng hô");
      }
      const guest = await updateGuestInvite({
        id: body.id,
        slug: body.slug,
        name: body.name,
        salutation: body.salutation,
      });
      const guests = await listGuestInvites();
      return NextResponse.json({ guest, guests });
    }

    if (action === "deleteGuest") {
      if (!body.id) {
        return badRequest("Thiếu id");
      }
      await deleteGuestInvite(body.id);
      const guests = await listGuestInvites();
      return NextResponse.json({ guests });
    }

    const [rsvps, wishes, guests] = await Promise.all([
      listRsvps(),
      listWishes(),
      listGuestInvites(),
    ]);
    return NextResponse.json({ rsvps, wishes, guests });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Lỗi xử lý";
    return badRequest(message);
  }
}
