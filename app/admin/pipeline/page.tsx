import { isLoggedIn } from "@/lib/auth";
import DeskLogin from "../../desk/DeskLogin";
import AdminNav from "@/app/components/AdminNav";
import { people, STAGES, STAGE_LABEL } from "@/lib/crm";
import PipelineClient, { type Card } from "./PipelineClient";

export const dynamic = "force-dynamic";

export default async function Pipeline() {
  const session = await isLoggedIn();
  if (!session) return <DeskLogin />;
  const all = await people();
  const cards: Card[] = all.map((p) => ({
    email: p.email, name: p.name, phone: p.phone, ghlContactId: p.ghlContactId,
    stage: p.stage, derived: p.derived, offers: p.offers, interestedIn: p.interestedIn, sources: p.sources,
    lastActivity: p.lastActivity, paidPHP: p.paidPHP, balancePHP: p.balancePHP,
    openOrderId: p.orders.find((o) => o.status !== "paid" && o.status !== "cancelled")?.id,
    note: p.note, nextAction: p.nextAction,
  }));
  const ghlLocation = process.env.GHL_LOCATION_ID || "";

  return (
    <>
      <AdminNav current="/admin/pipeline" user={session} />
      <div className="wrap-wide" style={{ maxWidth: 1400 }}>
        <p className="kicker">Pipeline</p>
        <h1 style={{ margin: "4px 0 6px" }}>From first hello to onboarded.</h1>
        <p className="muted" style={{ maxWidth: "70ch" }}>
          Every person, in the stage they are actually in. Stages move on their own when someone applies, gets a link, pays or finishes onboarding — you only set the human steps in between. Emails, agreements and reminders are sent by GoHighLevel.
        </p>
        <PipelineClient cards={cards} stages={STAGES as unknown as string[]} labels={STAGE_LABEL} ghlLocation={ghlLocation} />
      </div>
    </>
  );
}
