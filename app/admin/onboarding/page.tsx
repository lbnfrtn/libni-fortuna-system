import { isLoggedIn } from "@/lib/auth";
import DeskLogin from "../../desk/DeskLogin";
import AdminNav from "@/app/components/AdminNav";
import { store } from "@/lib/store";
import OnboardingClient, { type ObRow } from "./OnboardingClient";

export const dynamic = "force-dynamic";

export default async function Onboarding() {
  const session = await isLoggedIn();
  if (!session) return <DeskLogin />;
  const orders = await store().list();
  const now = Date.now();

  // Anyone who has paid at least the first instalment is "onboarding".
  const rows: ObRow[] = orders
    .filter((o) => o.status !== "cancelled" && o.amountPaidPHP > 0)
    .map((o) => {
      const firstPaid = o.instalments.find((i) => i.status === "paid")?.paidAt ?? o.paidAt ?? o.createdAt;
      return {
        id: o.id, client: o.contact.name, email: o.contact.email, offer: o.offerName,
        paidAt: firstPaid, hoursSincePaid: (now - new Date(firstPaid).getTime()) / 3_600_000,
        ob: o.onboarding ?? {},
      };
    })
    .sort((a, b) => b.paidAt.localeCompare(a.paidAt));

  const pending = rows.filter((r) => !r.ob.complete).length;

  return (
    <>
      <AdminNav current="/admin/onboarding" user={session} />
      <div className="wrap-wide">
        <p className="kicker">Onboarding</p>
        <h1 style={{ margin: "4px 0 6px" }}>{pending} in progress</h1>
        <p className="muted">
          GHL sends the welcome, agreement and intake automatically. Tick each step here as it happens so nothing slips.
          Anyone paid more than 48 hours ago and not finished gets a &ldquo;nudge?&rdquo; flag. When all four are ticked, they&rsquo;re tagged <code>onboarded</code> in GHL.
        </p>
        <div style={{ marginTop: 16 }}>
          <OnboardingClient initial={rows} />
        </div>
      </div>
    </>
  );
}
