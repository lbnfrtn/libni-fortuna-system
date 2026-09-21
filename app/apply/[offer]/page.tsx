import { getOffer, isSellable } from "@/config/offers";
import { questionsFor } from "@/config/forms";
import { notFound } from "next/navigation";
import LeadForm from "./LeadForm";

export const dynamic = "force-dynamic";

export default async function ApplyPage({ params }: { params: Promise<{ offer: string }> }) {
  const { offer: slug } = await params;
  const offer = getOffer(slug);
  if (!offer) notFound();
  const { track, heading, sub, questions } = questionsFor(slug);
  const waitlist = offer.waitlistOnly || offer.pricePHP == null;

  return (
    <div className="wrap">
      <p className="kicker">{offer.track === "consumer" ? "Work with Libni" : offer.track === "corporate" ? "For organizations" : "For brands"}</p>
      <h1>{heading}</h1>
      <p className="muted" style={{ fontSize: 17 }}>{sub}</p>
      {waitlist && (
        <div className="note" style={{ margin: "12px 0 20px" }}>
          This one isn&rsquo;t open right now — your details join the waitlist and I&rsquo;ll reach out when the next round opens.
        </div>
      )}
      {isSellable(offer) && offer.journey === "A" && (
        <p className="muted" style={{ fontSize: 14, marginTop: -4 }}>
          After this you&rsquo;ll get a link to book and pay.
        </p>
      )}
      <div style={{ marginTop: 16 }}>
        <LeadForm offerSlug={slug} track={track} questions={questions} />
      </div>
    </div>
  );
}
