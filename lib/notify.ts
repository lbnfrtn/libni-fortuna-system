// ============================================================================
// Internal alerts for Libni / the EA — "you got paid", "proof submitted",
// "instalment overdue". Logged to the server log (visible in Vercel → Logs).
// The admin's Today page surfaces the same things as live counts, so nothing
// here is the only place a task can be seen.
// ============================================================================

export async function notifyTeam(subject: string, detail: Record<string, unknown>): Promise<void> {
  // eslint-disable-next-line no-console
  console.log(`[notify] ${subject}`, JSON.stringify(detail));
}
