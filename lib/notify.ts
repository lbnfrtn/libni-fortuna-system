import { sendMail, mailConfigured } from "@/lib/mail";

// ============================================================================
// Internal alerts for Libni / the EA — "you got paid", "proof submitted",
// "instalment overdue". Always logged to the server log (Vercel → Logs), and
// also emailed to Libni when mail is live, so she's pinged on each sale and can
// personally follow up. The admin's Today page surfaces the same as live counts.
// ============================================================================

function ownerEmail(): string {
  return (process.env.NOTIFY_OWNER_EMAIL || "hello@libni.co").trim();
}

export async function notifyTeam(subject: string, detail: Record<string, unknown>): Promise<void> {
  // eslint-disable-next-line no-console
  console.log(`[notify] ${subject}`, JSON.stringify(detail));
  // A heads-up email to Libni. Never let an alert failure affect a payment.
  try {
    const to = ownerEmail();
    if (!to || !mailConfigured()) return;
    const lines = Object.entries(detail).map(([k, v]) => `${k}: ${v}`).join("\n");
    await sendMail({ to, subject: `[libni.co] ${subject}`, text: `${subject}\n\n${lines}\n` });
  } catch {
    /* ignore — the log line above is still written */
  }
}
