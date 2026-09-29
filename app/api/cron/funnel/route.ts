import { NextResponse } from "next/server";
import { runDue } from "@/lib/funnel";

export const runtime = "nodejs";

// Hourly (vercel.json): sends every sequence letter that has come due.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const r = await runDue();
  return NextResponse.json({ ok: true, ...r });
}
