import { OFFERS } from "@/config/offers";
import { getContent } from "@/lib/content";
import JoinClient from "./JoinClient";

export const dynamic = "force-dynamic";

export default async function LiberateJoinPage() {
  const offer = OFFERS.liberate;
  const open = offer.pricePHP != null && !offer.waitlistOnly;
  // The "book a call" link is the Liberate alignment call (Studio-editable); falls back to the details form.
  const { links } = await getContent();
  const callHref = links.calendlyLiberate || "/liberate/apply";
  return (
    <div className="wrap">
      <p className="kicker">Liberate · begins November 17, 2026 · Tuesdays &amp; Thursdays, 7 pm</p>
      <h1>Join Liberate</h1>
      <p className="muted" style={{ fontSize: 17 }}>Choose how you’d like to pay, leave your details, and your place is held the moment your payment clears.</p>
      <div style={{ marginTop: 16 }}>
        {open ? (
          <JoinClient price={offer.pricePHP!} count={offer.instalmentCount ?? 3} refundNote={offer.refundNote} callHref={callHref} />
        ) : (
          <div className="note">Liberate isn’t open for payment right now — <a href="/liberate/apply">leave your details</a> and I’ll reach out when the next intake opens.</div>
        )}
      </div>
    </div>
  );
}
