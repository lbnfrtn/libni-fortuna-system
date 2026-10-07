import { isLoggedIn } from "@/lib/auth";
import DeskLogin from "../../desk/DeskLogin";
import AdminNav from "@/app/components/AdminNav";
import { people, STAGES, STAGE_LABEL, MANUAL_STAGES } from "@/lib/crm";
import { questionsFor } from "@/config/forms";
import { getOffer } from "@/config/offers";
import { peso } from "@/lib/util";
import PipelineClient, { type Card } from "./PipelineClient";

// "where_now" -> "Where now" when a question has since been renamed or removed.
const humanize = (id: string) => id.replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase());

export const dynamic = "force-dynamic";

export default async function Pipeline() {
  const session = await isLoggedIn();
  if (!session) return <DeskLogin />;
  const all = await people();
  const offerName = (slug: string) => getOffer(slug)?.name ?? slug;

  const cards: Card[] = all.map((p) => {
    // Everything that has happened with this person, newest first.
    const timeline: { at: string; text: string }[] = [];
    for (const l of p.leads) {
      const what = l.waitlisted ? "Joined the waitlist" : l.tags?.some((t) => t.startsWith("applied:")) ? "Applied" : l.tags?.includes("nurture") ? "Imported from your old leads" : "Reached out";
      timeline.push({ at: l.at, text: `${what} · ${offerName(l.offerSlug)}${l.source ? ` · via ${l.source}` : ""}` });
    }
    for (const o of p.orders) {
      timeline.push({ at: o.createdAt, text: `Payment link created · ${o.offerName} · ${peso(o.totalPHP)}` });
      if (o.manual?.submittedAt) timeline.push({ at: o.manual.submittedAt, text: `Sent bank-transfer proof · ${o.offerName}` });
      for (const i of o.instalments) {
        if (i.status === "paid" && i.paidAt) {
          timeline.push({ at: i.paidAt, text: `Paid ${peso(i.paidAmountPHP ?? i.amountPHP)}${o.instalments.length > 1 ? ` · payment ${i.n} of ${o.instalments.length}` : ""} · ${o.offerName}` });
        }
      }
      if (o.onboarding?.complete && o.onboarding.updatedAt) timeline.push({ at: o.onboarding.updatedAt, text: `Onboarding complete · ${o.offerName}` });
      if (o.status === "cancelled") timeline.push({ at: o.createdAt, text: `Order cancelled · ${o.offerName}` });
    }
    timeline.sort((a, b) => b.at.localeCompare(a.at));

    return {
      email: p.email, name: p.name, phone: p.phone,
      stage: p.stage, derived: p.derived, offers: p.offers, interestedIn: p.interestedIn, sources: p.sources,
      firstSeen: p.firstSeen, lastActivity: p.lastActivity, paidPHP: p.paidPHP, balancePHP: p.balancePHP,
      openOrderId: p.orders.find((o) => o.status !== "paid" && o.status !== "cancelled")?.id,
      note: p.note, nextAction: p.nextAction,
      tags: [...new Set(p.leads.flatMap((l) => l.tags ?? []))],
      orders: p.orders.map((o) => ({
        id: o.id, offerName: o.offerName, totalPHP: o.totalPHP, amountPaidPHP: o.amountPaidPHP, balancePHP: o.balancePHP, status: o.status,
        instalments: o.instalments.map((i) => ({ n: i.n, amountPHP: i.amountPHP, dueDate: i.dueDate, status: i.status })),
      })),
      // Every form they've filled in, newest first, with the question wording.
      answers: p.leads.filter((l) => l.answers && Object.keys(l.answers).length).map((l) => {
        const labels = new Map(questionsFor(l.offerSlug).questions.map((q) => [q.id, q.label]));
        return {
          form: offerName(l.offerSlug),
          at: l.at,
          items: Object.entries(l.answers ?? {}).filter(([, v]) => String(v).trim()).map(([k, v]): [string, string] => [labels.get(k) ?? humanize(k), String(v)]),
        };
      }),
      timeline,
    };
  });

  return (
    <>
      <AdminNav current="/admin/pipeline" user={session} />
      <div className="wrap-wide" style={{ maxWidth: "none" }}>
        <PipelineClient cards={cards} stages={STAGES as unknown as string[]} labels={STAGE_LABEL} manual={MANUAL_STAGES as unknown as string[]} />
      </div>
    </>
  );
}
