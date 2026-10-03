import { OFFERS } from "@/config/offers";
import JoinClient from "./JoinClient";

export const dynamic = "force-dynamic";

export default function LiberateJoinPage() {
  const offer = OFFERS.liberate;
  const open = offer.pricePHP != null && !offer.waitlistOnly;
  return (
    <div className="wrap">
      <p className="kicker">Liberate · begins October 12, 2026</p>
      <h1>Join Liberate</h1>
      <p className="muted" style={{ fontSize: 17 }}>Choose how you’d like to pay, leave your details, and your place is held the moment your payment clears.</p>
      <div style={{ marginTop: 16 }}>
        {open ? (
          <JoinClient price={offer.pricePHP!} count={offer.instalmentCount ?? 3} refundNote={offer.refundNote} />
        ) : (
          <div className="note">Liberate isn’t open for payment right now — <a href="/liberate/apply">leave your details</a> and I’ll reach out when the next intake opens.</div>
        )}
      </div>
    </div>
  );
}
