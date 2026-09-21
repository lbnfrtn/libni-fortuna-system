import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth";
import { setNote, MANUAL_STAGES, type Stage } from "@/lib/crm";

export const dynamic = "force-dynamic";

// Libni's hand-set pipeline steps + notes. Everything else is derived.
export async function POST(req: NextRequest) {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim();
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    const patch: { stage?: Stage; note?: string; nextAction?: string } = {};
    if ("stage" in body) {
      const s = body.stage as string;
      if (s === "" || s === null) patch.stage = undefined;
      else if ((MANUAL_STAGES as string[]).includes(s)) patch.stage = s as Stage;
      else return NextResponse.json({ error: "That stage is set by the system, not by hand" }, { status: 400 });
    }
    if ("note" in body) patch.note = String(body.note ?? "").slice(0, 2000);
    if ("nextAction" in body) patch.nextAction = String(body.nextAction ?? "").slice(0, 300);

    return NextResponse.json({ ok: true, note: await setNote(email, patch) });
  } catch (err) {
    console.error("POST /api/crm:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
