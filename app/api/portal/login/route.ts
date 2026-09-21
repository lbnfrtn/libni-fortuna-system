import { NextRequest, NextResponse } from "next/server";
import { portalLogin, PORTAL_COOKIE } from "@/lib/portal-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, code, program } = await req.json();
    const r = await portalLogin(String(email ?? ""), String(code ?? ""), program === "one-on-one" ? "one-on-one" : "liberate");
    if (!r.ok) return NextResponse.json({ ok: false, error: r.error }, { status: 401 });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(r.name, r.value, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 120 });
    return res;
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PORTAL_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
