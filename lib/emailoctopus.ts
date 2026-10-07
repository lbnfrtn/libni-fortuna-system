// ============================================================================
// EMAILOCTOPUS — the only file that talks to EmailOctopus (Libni's mailing
// list). The site still sends its own receipts and delivery letters; this
// just keeps her list in step: who started checkout, who bought, and each
// buyer's personal download link. Tags trigger her automations there.
//
// MOCK MODE: with no EMAILOCTOPUS_API_KEY we only log what we would send, so
// local testing never touches her real list. EMAILOCTOPUS_LIST_ID is optional:
// EmailOctopus's new app hides list ids, so without it we use her list (the
// biggest one, if there's ever more than one).
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
  return Boolean(process.env.EMAILOCTOPUS_API_KEY);
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

let found: Promise<string> | null = null;

/** The list to add people to: EMAILOCTOPUS_LIST_ID, else looked up once per server instance. */
export function listId(): Promise<string> {
  const set = process.env.EMAILOCTOPUS_LIST_ID?.trim();
  if (set) return Promise.resolve(set);
  if (!found) {
    found = (async () => {
      const res = await call("GET", "/lists?limit=100");
      if (!res.ok) throw new Error(`EmailOctopus lists (${res.status}): ${(await res.text()).slice(0, 300)}`);
      const j = (await res.json()) as { data?: { id: string; name?: string; counts?: { subscribed?: number } }[] };
      const lists = [...(j.data || [])].sort((a, b) => (b.counts?.subscribed ?? 0) - (a.counts?.subscribed ?? 0));
      if (!lists.length) throw new Error("EmailOctopus: this account has no list yet");
      console.log(`[emailoctopus] using list "${lists[0].name ?? ""}" (${lists[0].id})${lists.length > 1 ? ` — biggest of ${lists.length}` : ""}`);
      return lists[0].id;
    })().catch((e) => { found = null; throw e; });
  }
  return found;
}

/** Test hook: forget the looked-up list. */
export function resetListCache(): void {
  found = null;
  ensured.clear();
}

const ensured = new Set<string>();

/** Create a text custom field on the list if it isn't there yet (once per server instance). */
export async function ensureField(tag: string, label: string): Promise<void> {
  if (!listConfigured() || ensured.has(tag)) return;
  const res = await call("POST", `/lists/${await listId()}/fields`, { label, tag, type: "text" });
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
    const res = await call("PUT", `/lists/${await listId()}/contacts`, {
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
