import { isLoggedIn } from "@/lib/auth";
import DeskLogin from "../../desk/DeskLogin";
import AdminNav from "@/app/components/AdminNav";
import { people, STAGES, STAGE_LABEL } from "@/lib/crm";
import { questionsFor } from "@/config/forms";
import { getOffer } from "@/config/offers";
import PipelineClient, { type Card } from "./PipelineClient";

// "where_now" -> "Where now" when a question has since been renamed or removed.
const humanize = (id: string) => id.replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase());

export const dynamic = "force-dynamic";

export default async function Pipeline() {
  const session = await isLoggedIn();
  if (!session) return <DeskLogin />;
  const all = await people();
  const cards: Card[] = all.map((p) => ({
    email: p.email, name: p.name, phone: p.phone,
    stage: p.stage, derived: p.derived, offers: p.offers, interestedIn: p.interestedIn, sources: p.sources,
    lastActivity: p.lastActivity, paidPHP: p.paidPHP, balancePHP: p.balancePHP,
    openOrderId: p.orders.find((o) => o.status !== "paid" && o.status !== "cancelled")?.id,
    note: p.note, nextAction: p.nextAction,
    // Every form they've filled in, newest first, with the question wording.
    answers: p.leads.filter((l) => l.answers && Object.keys(l.answers).length).map((l) => {
      const labels = new Map(questionsFor(l.offerSlug).questions.map((q) => [q.id, q.label]));
      return {
        form: getOffer(l.offerSlug)?.name ?? l.offerSlug,
        at: l.at,
        items: Object.entries(l.answers ?? {}).filter(([, v]) => String(v).trim()).map(([k, v]): [string, string] => [labels.get(k) ?? humanize(k), String(v)]),
      };
    }),
  }));

  return (
    <>
      <AdminNav current="/admin/pipeline" user={session} />
      <div className="wrap-wide" style={{ maxWidth: 1400 }}>
        <p className="kicker">Pipeline</p>
        <h1 style={{ margin: "4px 0 6px" }}>From first hello to onboarded.</h1>
        <p className="muted" style={{ maxWidth: "70ch" }}>
          Every person, in the stage they are actually in. Stages move on their own when someone applies, gets a link, pays or finishes onboarding — you only set the human steps in between. Letters and reminders go out automatically from Email &amp; funnel.
        </p>
        <PipelineClient cards={cards} stages={STAGES as unknown as string[]} labels={STAGE_LABEL} />
      </div>
    </>
  );
}
