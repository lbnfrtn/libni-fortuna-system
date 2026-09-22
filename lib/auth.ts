import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

// ============================================================================
// Payment Desk gate. Simple by design for two users (spec §7.3 asks for
// Firebase Auth; we start with a shared passcode + email allow-list, which is
// enough for Libni + EA and trivial for the EA to use. Swap for Firebase Auth
// before go-live if per-person login is wanted — noted in HANDOFF.md).
//
// In local development with DESK_PASSCODE blank, the gate is OPEN so Libni can
// try the Desk immediately on her own machine. In production a blank passcode
// LOCKS the Desk instead. Sessions are HMAC-signed so a cookie can't be forged
// from a known email.
// ============================================================================

const COOKIE = "lf_desk";
const secret = () => process.env.PORTAL_SECRET || process.env.DESK_PASSCODE || "local-dev-desk";

function sign(email: string): string {
  const payload = Buffer.from(JSON.stringify({ email, at: Date.now() })).toString("base64url");
  const mac = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}
function verify(token: string): string | null {
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const expect = createHmac("sha256", secret()).update(payload).digest("base64url");
  if (expect.length !== mac.length || !timingSafeEqual(Buffer.from(expect), Buffer.from(mac))) return null;
  try { return String(JSON.parse(Buffer.from(payload, "base64url").toString("utf8")).email); } catch { return null; }
}

export function allowedEmails(): string[] {
  const owner = (process.env.DESK_OWNER_EMAIL || "").toLowerCase().trim();
  const assistants = (process.env.DESK_ASSISTANT_EMAILS || "")
    .split(",")
    .map((s) => s.toLowerCase().trim())
    .filter(Boolean);
  return [owner, ...assistants].filter(Boolean);
}

export function roleFor(email: string): "owner" | "assistant" | null {
  const e = email.toLowerCase().trim();
  if (e && e === (process.env.DESK_OWNER_EMAIL || "").toLowerCase().trim()) return "owner";
  if (allowedEmails().includes(e)) return "assistant";
  return null;
}

/** Check the passcode + email. Returns the role, or null on failure. */
export function checkLogin(email: string, passcode: string): "owner" | "assistant" | null {
  const expected = process.env.DESK_PASSCODE || "";
  if (!expected && process.env.NODE_ENV === "production") return null;
  if (expected && passcode !== expected) return null;
  return roleFor(email);
}

export async function isLoggedIn(): Promise<{ email: string; role: "owner" | "assistant" } | null> {
  if (!process.env.DESK_PASSCODE) {
    // No passcode opens the gate for local development only; in production it locks it.
    if (process.env.NODE_ENV === "production") return null;
    const email = process.env.DESK_OWNER_EMAIL || "test@localhost";
    return { email, role: "owner" };
  }
  const raw = (await cookies()).get(COOKIE)?.value;
  const email = raw ? verify(raw) : null;
  if (!email) return null;
  const role = roleFor(email);
  return role ? { email, role } : null;
}

export function sessionCookie(email: string): { name: string; value: string } {
  return { name: COOKIE, value: sign(email) };
}

export const DESK_COOKIE = COOKIE;
