// ============================================================================
// EMAILOCTOPUS — the only file that talks to EmailOctopus (Libni's mailing
// list). The site still sends its own receipts and delivery letters; this
// just keeps her list in step: who started checkout, who bought, and each
// buyer's personal download link. Tags trigger her automations there.
//
// MOCK MODE: with no EMAILOCTOPUS_API_KEY / EMAILOCTOPUS_LIST_ID we only log
// what we would send, so local testing never touches her real list.
// API v2: PUT /lists/{list_id}/contacts creates or updates by email.
// ============================================================================

const API = "https://api.emailoctopus.com";

export interface ListContact {
  email: string;
  name?: string;
  /** tag -> true adds it, false removes it. */
  tags?: Record<string, boolean>;
  /** Custom field tag -> value (the field must exist on the list; see ensureField). */
  fields?: Record<string, string>;
}

export interface ListResult { ok: boolean; mock?: boolean; error?: string }

export function listConfigured(): boolean {
  return Boolean(process.env.EMAILOCTOPUS_API_KEY && process.env.EMAILOCTOPUS_LIST_ID);
}

function splitName(name = ""): { FirstName?: string; LastName?: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return {};
  return { FirstName: parts[0], ...(parts.length > 1 ? { LastName: parts.slice(1).join(" ") } : {}) };
}

async function call(method: string, path: string, body?: unknown): Promise<Response> {
  return fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${process.env.EMAILOCTOPUS_API_KEY}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

const ensured = new Set<string>();

/** Create a text custom field on the list if it isn't there yet (once per server instance). */
export async function ensureField(tag: string, label: string): Promise<void> {
  if (!listConfigured() || ensured.has(tag)) return;
  const res = await call("POST", `/lists/${process.env.EMAILOCTOPUS_LIST_ID}/fields`, { label, tag, type: "text" });
  // 409 = the field already exists, which is what we want.
  if (!res.ok && res.status !== 409) throw new Error(`EmailOctopus field ${tag} (${res.status}): ${(await res.text()).slice(0, 300)}`);
  ensured.add(tag);
}

/** Add or update one person on Libni's list. Never throws — the sale must never fail because of the list. */
export async function upsertContact(c: ListContact): Promise<ListResult> {
  const email = c.email.trim().toLowerCase();
  const fields = { ...splitName(c.name), ...(c.fields || {}) };
  if (!listConfigured()) {
    console.log("[emailoctopus:mock] upsert", JSON.stringify({ email, tags: c.tags, fields: Object.keys(fields) }));
    return { ok: true, mock: true };
  }
  try {
    for (const tag of Object.keys(c.fields || {})) await ensureField(tag, tag);
    const res = await call("PUT", `/lists/${process.env.EMAILOCTOPUS_LIST_ID}/contacts`, {
      email_address: email,
      fields,
      tags: c.tags || {},
      status: "subscribed",
    });
    if (!res.ok) return { ok: false, error: `EmailOctopus ${res.status}: ${(await res.text()).slice(0, 300)}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e instanceof Error ? e.message : e) };
  }
}
