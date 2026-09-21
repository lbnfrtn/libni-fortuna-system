// ============================================================================
// GOHIGHLEVEL — the ONLY file that talks to GHL. The rule from the spec:
// code writes DATA and adds a TAG; a GHL workflow (that the EA can edit) does
// all the client-facing communicating. So this file never sends emails — it
// upserts the contact, sets fields, moves the opportunity, and adds the tag.
//
// SAFE MODE: if GHL_API_TOKEN is empty, every call is a no-op that just logs
// what it WOULD have sent. So local testing never touches the real CRM.
// ============================================================================

const GHL_API = "https://services.leadconnectorhq.com";

function safeMode(): boolean {
  return !process.env.GHL_API_TOKEN;
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.GHL_API_TOKEN}`,
    Version: process.env.GHL_API_VERSION || "2021-07-28",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

function locationId(): string {
  return process.env.GHL_LOCATION_ID || "";
}

/** Records what safe-mode "would have done", so tests and the UI can show it. */
export const ghlLog: Array<{ at: string; action: string; detail: unknown }> = [];
function log(action: string, detail: unknown) {
  ghlLog.push({ at: new Date().toISOString(), action, detail });
  // eslint-disable-next-line no-console
  console.log(`[GHL${safeMode() ? " safe-mode" : ""}] ${action}`, JSON.stringify(detail));
}

export interface UpsertContactInput {
  name: string;
  email: string;
  phone?: string;
  tags?: string[];
  /** { customFieldId: value } — ids come from the GHL Build Sheet. */
  customFields?: Record<string, string | number>;
  source?: string;
}

export interface UpsertContactResult {
  contactId: string;
  isNew: boolean;
}

export async function upsertContact(input: UpsertContactInput): Promise<UpsertContactResult> {
  const payload = {
    locationId: locationId(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    source: input.source,
    tags: input.tags,
    customFields: input.customFields
      ? Object.entries(input.customFields).map(([id, value]) => ({ id, value }))
      : undefined,
  };
  if (safeMode()) {
    log("upsertContact", payload);
    return { contactId: `safe_${Buffer.from(input.email).toString("hex").slice(0, 12)}`, isNew: true };
  }
  const res = await fetch(`${GHL_API}/contacts/upsert`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  const json = (await res.json()) as { contact?: { id: string }; new?: boolean; message?: string };
  if (!res.ok || !json.contact?.id) {
    throw new Error(`GHL upsertContact failed (${res.status}): ${json.message || JSON.stringify(json)}`);
  }
  return { contactId: json.contact.id, isNew: json.new ?? false };
}

export async function addTags(contactId: string, tags: string[]): Promise<void> {
  if (!tags.length) return;
  if (safeMode()) return log("addTags", { contactId, tags });
  const res = await fetch(`${GHL_API}/contacts/${contactId}/tags`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ tags }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GHL addTags failed (${res.status}): ${t}`);
  }
}

export async function setCustomFields(
  contactId: string,
  fields: Record<string, string | number>
): Promise<void> {
  const entries = Object.entries(fields);
  if (!entries.length) return;
  if (safeMode()) return log("setCustomFields", { contactId, fields });
  const res = await fetch(`${GHL_API}/contacts/${contactId}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ customFields: entries.map(([id, value]) => ({ id, value })) }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GHL setCustomFields failed (${res.status}): ${t}`);
  }
}

export interface OpportunityInput {
  contactId: string;
  pipelineId: string;
  stageId: string;
  name: string;
  monetaryValuePHP?: number;
  status?: "open" | "won" | "lost" | "abandoned";
}

export async function upsertOpportunity(input: OpportunityInput): Promise<{ opportunityId: string }> {
  const payload = {
    locationId: locationId(),
    contactId: input.contactId,
    pipelineId: input.pipelineId,
    pipelineStageId: input.stageId,
    name: input.name,
    monetaryValue: input.monetaryValuePHP,
    status: input.status || "open",
  };
  if (safeMode()) {
    log("upsertOpportunity", payload);
    return { opportunityId: `safe_opp_${Date.now()}` };
  }
  const res = await fetch(`${GHL_API}/opportunities/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  const json = (await res.json()) as { opportunity?: { id: string }; id?: string; message?: string };
  const id = json.opportunity?.id || json.id;
  if (!res.ok || !id) {
    throw new Error(`GHL upsertOpportunity failed (${res.status}): ${json.message || JSON.stringify(json)}`);
  }
  return { opportunityId: id };
}

/** Internal alert to Libni/EA ("you got paid", "proof submitted"). In safe
 *  mode just logs; wired to a GHL internal-notification workflow at go-live. */
export async function notifyTeam(subject: string, detail: Record<string, unknown>): Promise<void> {
  log("notifyTeam", { subject, ...detail });
}
