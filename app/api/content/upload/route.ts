import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth";
import { setPhoto } from "@/lib/content";
import { putUpload, uploadError } from "@/lib/uploads";
import { isValidSlot } from "@/config/site-slots";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const form = await req.formData();
    const slotId = String(form.get("slotId") ?? "");
    const file = form.get("file");

    if (!isValidSlot(slotId)) {
      return NextResponse.json({ error: "Unknown photo slot" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }
    const bad = uploadError(file);
    if (bad) return NextResponse.json({ error: bad }, { status: 400 });

    const url = await putUpload(slotId, file.type, Buffer.from(await file.arrayBuffer()));
    await setPhoto(slotId, url);
    return NextResponse.json({ ok: true, slotId, url });
  } catch (err) {
    console.error("POST /api/content/upload:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
