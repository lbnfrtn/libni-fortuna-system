import { cookies } from "next/headers";

// ============================================================================
// Payment Desk gate. Simple by design for two users (spec §7.3 asks for
// Firebase Auth; we start with a shared passcode + email allow-list, which is
// enough for Libni + EA and trivial for the EA to use. Swap for Firebase Auth
// before go-live if per-person login is wanted — noted in HANDOFF.md).
//
// In local testing with DESK_PASSCODE blank, the gate is OPEN so Libni can try
// the Desk immediately on her own machine.
// ============================================================================

const COOKIE = "lf_desk";

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
  if (expected && passcode !== expected) return null;
  return roleFor(email);
}

export async function isLoggedIn(): Promise<{ email: string; role: "owner" | "assistant" } | null> {
  // Open gate while testing locally with no passcode set.
  if (!process.env.DESK_PASSCODE) {
    const email = process.env.DESK_OWNER_EMAIL || "test@localhost";
    return { email, role: "owner" };
  }
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const { email } = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    const role = roleFor(email);
    return role ? { email, role } : null;
  } catch {
    return null;
  }
}

export function sessionCookie(email: string): { name: string; value: string } {
  return { name: COOKIE, value: Buffer.from(JSON.stringify({ email }), "utf8").toString("base64") };
}

export const DESK_COOKIE = COOKIE;
