import { createHmac, timingSafeEqual } from "node:crypto";

// ============================================================================
// The one place email leaves the site. Resend's REST API, no SDK. With no
// RESEND_API_KEY every send is logged instead of delivered, so local/test mode
// never emails a real person. Unsubscribe links are signed so nobody can
// unsubscribe someone else.
// ============================================================================

export interface MailInput {
  to: string;
  subject: string;
  /** Plain text with blank lines between paragraphs; URLs become links. */
  text: string;
  unsubscribeUrl?: string;
}
export interface MailResult { ok: boolean; id?: string; mock?: boolean; error?: string }

export function mailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
export function mailFrom(): string {
  return process.env.MAIL_FROM || "Libni Fortuna <hello@libni.co>";
}
export function siteUrl(): string {
  return (process.env.APP_BASE_URL || "http://localhost:4310").replace(/\/$/, "");
}

function secret(): string {
  return process.env.MAIL_SECRET || process.env.PORTAL_SECRET || process.env.DESK_PASSCODE || "dev-only-secret";
}
export function unsubscribeToken(email: string): string {
  return createHmac("sha256", secret()).update(email.trim().toLowerCase()).digest("hex").slice(0, 32);
}
export function unsubscribeTokenValid(email: string, token: string): boolean {
  const a = Buffer.from(unsubscribeToken(email));
  const b = Buffer.from(String(token || ""));
  return a.length === b.length && timingSafeEqual(a, b);
}
export function unsubscribeUrl(email: string): string {
  return `${siteUrl()}/unsubscribe?e=${encodeURIComponent(email)}&t=${unsubscribeToken(email)}`;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Plain text → the branded HTML letter. Paragraphs on blank lines, single newlines kept, links clickable. */
export function toHtml(text: string, unsubscribe?: string): string {
  const paras = text.trim().split(/\n{2,}/).map((p) => {
    const safe = esc(p).replace(/(https?:\/\/[^\s<]+)/g, (u) => `<a href="${u}" style="color:#5b4470;text-decoration:underline;">${u}</a>`).replace(/\n/g, "<br />");
    return `<p style="margin:0 0 18px;font-size:17px;line-height:1.7;color:#2b2528;">${safe}</p>`;
  });
  return `<!doctype html><html><body style="margin:0;padding:0;background:#fbf9f6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf9f6;"><tr><td align="center" style="padding:36px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:Karla,Helvetica,Arial,sans-serif;">
<tr><td style="padding:0 0 26px;font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;color:#2b2528;">Libni Fortuna<span style="display:block;font-family:Karla,Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#b8955a;margin-top:2px;">Come home to yourself</span></td></tr>
<tr><td style="background:#ffffff;padding:34px 30px;border:1px solid #e9e1d7;">${paras.join("")}</td></tr>
<tr><td style="padding:22px 6px 0;font-size:12px;line-height:1.6;color:#8a7d78;">You're receiving this because you signed up at libni.co.${unsubscribe ? ` <a href="${unsubscribe}" style="color:#8a7d78;">Unsubscribe</a>` : ""}</td></tr>
</table></td></tr></table></body></html>`;
}

export async function sendMail(input: MailInput): Promise<MailResult> {
  const html = toHtml(input.text, input.unsubscribeUrl);
  const headers: Record<string, string> = {};
  if (input.unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${input.unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }
  if (!mailConfigured()) {
    console.log(`[mail:mock] to=${input.to} subject=${JSON.stringify(input.subject)}`);
    return { ok: true, mock: true, id: `mock-${Date.now().toString(36)}` };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: mailFrom(), to: [input.to], reply_to: "hello@libni.co", subject: input.subject, html, text: input.text, headers }),
    });
    const j = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
    if (!res.ok) return { ok: false, error: j.message || j.name || `HTTP ${res.status}` };
    return { ok: true, id: j.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
