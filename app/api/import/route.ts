import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth";
import { parseCsv } from "@/lib/csv";
import { importBacklogRow, type BacklogRow } from "@/lib/lead";
import { z } from "zod";

export const runtime = "nodejs";

const rowSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  offerSlug: z.string().max(60).optional(),
  source: z.string().max(120).optional(),
  sourceDetail: z.string().max(200).optional(),
});

// Backlog import (spec §9). Owner/assistant only. Accepts pasted CSV with
// headers: name,email,phone,offerSlug,source,sourceDetail
export async function POST(req: Request) {
  const session = await isLoggedIn();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  let csv = "";
  try {
    ({ csv } = (await req.json()) as { csv: string });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = parseCsv(csv || "");
  if (!parsed.length) {
    return NextResponse.json({ error: "No rows found. Include a header row: name,email,phone,offerSlug,source,sourceDetail" }, { status: 400 });
  }

  const results = { imported: 0, skipped: 0, errors: [] as string[] };
  for (const raw of parsed) {
    const r = rowSchema.safeParse(raw);
    if (!r.success) {
      results.skipped++;
      results.errors.push(`${raw.email || raw.name || "row"}: ${r.error.issues[0]?.message}`);
      continue;
    }
    const out = await importBacklogRow(r.data as BacklogRow);
    if (out.ok) results.imported++;
    else {
      results.skipped++;
      results.errors.push(`${out.email}: ${out.error}`);
    }
  }
  return NextResponse.json({ ok: true, ...results, errors: results.errors.slice(0, 20) });
}
