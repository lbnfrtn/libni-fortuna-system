import { NextResponse } from "next/server";
import { runDue } from "@/lib/funnel";

export const runtime = "nodejs";

// Sends every sequence letter that has come due. Vercel's free plan only runs
// daily jobs, so the daily reminders cron calls runDue() too and this route is
// for an outside pinger (or a Pro-plan hourly schedule) whenever Libni wants
// letters to land closer to the hour they were due.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const r = await runDue();
  return NextResponse.json({ ok: true, ...r });
}
