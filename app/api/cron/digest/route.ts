import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { buildDigest, renderDigest } from "@/lib/digest";
import { notifyTeam } from "@/lib/ghl";
import { isLoggedIn } from "@/lib/auth";

export const runtime = "nodejs";

// Weekly digest to Libni (Vercel Cron, Sundays). In safe mode it logs the text;
// at go-live, point notifyTeam at a GHL internal email/workflow. The scheduled
// run is protected by CRON_SECRET; ?preview=1 requires a signed-in Desk session
// (it exposes revenue numbers, so it must never be open on the internet).
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const url = new URL(req.url);
  const preview = url.searchParams.get("preview") === "1";
  if (preview) {
    if (!(await isLoggedIn())) return NextResponse.json({ error: "Sign in to the Desk first." }, { status: 401 });
  } else if (secret) {
    if (req.headers.get("authorization") !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const orders = await store().list();
  const digest = buildDigest(orders);
  const text = renderDigest(digest);
  await notifyTeam("Weekly digest", { text });

  if (preview) return new NextResponse(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return NextResponse.json({ ok: true, digest });
}
