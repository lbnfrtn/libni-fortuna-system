import { NextResponse } from "next/server";
import { checkLogin, sessionCookie } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(`login:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }
  let email = "";
  let passcode = "";
  try {
    ({ email, passcode } = (await req.json()) as { email: string; passcode: string });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const role = checkLogin(email || "", passcode || "");
  if (!role) return NextResponse.json({ error: "Not recognised. Check your email and passcode." }, { status: 401 });

  const cookie = sessionCookie(email);
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(cookie.name, cookie.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // Thirty days: two people, one passcode, and the Studio is used in long sittings.
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
