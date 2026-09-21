import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { store } from "@/lib/store";
import { getContent } from "@/lib/content";
import { isLoggedIn } from "@/lib/auth";

// ============================================================================
// Member portal sign-in. Two programs live here:
//   liberate    — email + the cohort access code (sent in the welcome email
//                 by GHL); a member is anyone with a paid Liberate order.
//   one-on-one  — email only; a client is anyone with a paid The Becoming or
//                 Power Hour order. (Project Me has its own login at
//                 projectme.libni.co and is only linked from the picker.)
// The session is a signed cookie carrying email + program.
// ============================================================================

export type Program = "liberate" | "one-on-one";
export const PROGRAM_OFFERS: Record<Program, string[]> = { liberate: ["liberate"], "one-on-one": ["the-becoming", "ignite"] };
export const PROGRAM_HOME: Record<Program, string> = { liberate: "/portal/liberate", "one-on-one": "/portal/one-on-one" };

const COOKIE = "lf_member";
const secret = () => process.env.PORTAL_SECRET || process.env.DESK_PASSCODE || "local-dev-portal";

function sign(email: string, program: Program): string {
  const payload = Buffer.from(JSON.stringify({ email, program, at: Date.now() })).toString("base64url");
  const mac = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}
function verify(token: string): { email: string; program: Program } | null {
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const expect = createHmac("sha256", secret()).update(payload).digest("base64url");
  if (expect.length !== mac.length || !timingSafeEqual(Buffer.from(expect), Buffer.from(mac))) return null;
  try {
    const j = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return { email: String(j.email), program: j.program === "one-on-one" ? "one-on-one" : "liberate" };
  } catch { return null; }
}

/** Paid, live orders this email holds in the program. */
export async function memberOrders(email: string, program: Program) {
  const e = email.toLowerCase().trim();
  const orders = await store().list();
  return orders.filter((o) => PROGRAM_OFFERS[program].includes(o.offerSlug) && o.status !== "cancelled" && o.amountPaidPHP > 0 && o.contact.email.toLowerCase() === e);
}
export async function isMember(email: string, program: Program = "liberate"): Promise<boolean> {
  return (await memberOrders(email, program)).length > 0;
}

/** Returns the cookie to set, or an error message. */
export async function portalLogin(email: string, code: string, program: Program = "liberate"): Promise<{ ok: true; name: string; value: string } | { ok: false; error: string }> {
  const e = email.toLowerCase().trim();
  if (!e) return { ok: false, error: "Please enter your email." };
  if (program === "liberate") {
    const { liberate } = await getContent();
    if (liberate.accessCode && code.trim() !== liberate.accessCode.trim()) {
      return { ok: false, error: "That access code doesn’t match. It’s in your welcome email." };
    }
    if (!(await isMember(e, "liberate"))) {
      return { ok: false, error: "We can’t find a Liberate place under that email. Use the email you paid with, or reply to your welcome email." };
    }
  } else if (!(await isMember(e, "one-on-one"))) {
    return { ok: false, error: "We can’t find a 1:1 booking under that email. Use the email you paid with, or write to hello@libni.co." };
  }
  return { ok: true, name: COOKIE, value: sign(e, program) };
}

/** The signed-in member, if any. Admins are always let in, to every program. */
export async function currentMember(): Promise<{ email: string; admin: boolean; program: Program } | null> {
  const admin = await isLoggedIn();
  const raw = (await cookies()).get(COOKIE)?.value;
  const s = raw ? verify(raw) : null;
  // A signed-in member is that member even when Libni is also signed in as admin (so she can test as a client).
  if (s && (await isMember(s.email, s.program))) return { email: s.email, admin: Boolean(admin), program: s.program };
  if (admin) return { email: admin.email, admin: true, program: "liberate" };
  return null;
}

export const PORTAL_COOKIE = COOKIE;
