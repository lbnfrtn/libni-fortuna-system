import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth";
import { listLeads } from "@/lib/leadlog";

export const dynamic = "force-dynamic";

// CSV of everyone who opted in, for importing into a GHL list / campaign.
export async function GET() {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const leads = await listLeads(5000);
  const seen = new Set<string>();
  const rows = [["name", "email", "source", "interested_in", "first_seen"]];
  for (const l of leads.slice().reverse()) {
    const k = l.email.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    rows.push([l.name, l.email, l.source, l.offerSlug, l.at.slice(0, 10)]);
  }
  const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="audience-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
