import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth";
import { getFunnel, saveSequence, stopEnrolment, sendTest, broadcast, runDue, resubscribe, type Sequence } from "@/lib/funnel";
import { listLeads } from "@/lib/leadlog";
import { mailConfigured, mailFrom } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, funnel: await getFunnel(), configured: mailConfigured(), from: mailFrom() });
}

// Everything the Email page does: save a sequence, pause it, stop one person,
// send a test, send a letter to the list, run what's due right now.
export async function POST(req: NextRequest) {
  const session = await isLoggedIn();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const action = String(body.action ?? "");

    if (action === "saveSequence") {
      const seq = body.sequence as Sequence;
      if (!seq?.id) return NextResponse.json({ error: "Missing sequence" }, { status: 400 });
      return NextResponse.json({ ok: true, funnel: await saveSequence(seq) });
    }
    if (action === "stopEnrolment") {
      await stopEnrolment(String(body.id ?? ""));
      return NextResponse.json({ ok: true, funnel: await getFunnel() });
    }
    if (action === "resubscribe") {
      await resubscribe(String(body.email ?? ""));
      return NextResponse.json({ ok: true, funnel: await getFunnel() });
    }
    if (action === "test") {
      const r = await sendTest(session.email, String(body.subject ?? ""), String(body.body ?? ""));
      return NextResponse.json({ ok: r.ok, mock: r.mock, error: r.error, to: session.email, funnel: await getFunnel() });
    }
    if (action === "runDue") {
      const r = await runDue();
      return NextResponse.json({ ok: true, ...r, funnel: await getFunnel() });
    }
    if (action === "audienceCount" || action === "letter") {
      const audience = String(body.audience ?? "letters");
      const leads = await listLeads(5000);
      const uniq = new Map<string, { email: string; name: string }>();
      for (const l of leads) {
        const inList = audience === "everyone" || l.source === "newsletter" || l.source === "free-guide";
        if (inList && !uniq.has(l.email.toLowerCase())) uniq.set(l.email.toLowerCase(), { email: l.email, name: l.name });
      }
      const people = [...uniq.values()];
      if (action === "audienceCount") return NextResponse.json({ ok: true, count: people.length });
      if (session.role !== "owner") return NextResponse.json({ error: "Only Libni can send a letter to the list." }, { status: 403 });
      const subject = String(body.subject ?? "").trim();
      const text = String(body.body ?? "").trim();
      if (!subject || !text) return NextResponse.json({ error: "Write a subject and the letter first." }, { status: 400 });
      const r = await broadcast(people, subject, text);
      return NextResponse.json({ ok: true, ...r, funnel: await getFunnel() });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("POST /api/funnel:", err);
    return NextResponse.json({ error: String(err instanceof Error ? err.message : err) }, { status: 500 });
  }
}
