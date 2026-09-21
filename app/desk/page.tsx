import { isLoggedIn } from "@/lib/auth";
import { deskOffers } from "@/config/offers";
import DeskClient from "./DeskClient";
import DeskLogin from "./DeskLogin";
import AdminNav from "@/app/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function DeskPage() {
  const session = await isLoggedIn();
  if (!session) return <DeskLogin />;

  const offers = deskOffers().map((o) => ({
    slug: o.slug,
    name: o.name,
    pricePHP: o.pricePHP,
    priceUnit: o.priceUnit ?? null,
    allowPayInFull: o.allowPayInFull,
    allowInstalments: o.allowInstalments,
    instalmentCount: o.instalmentCount ?? 3,
    allowDeposit: o.allowDeposit,
    depositFraction: o.depositFraction ?? null,
    journey: o.journey,
    waitlistOnly: !!o.waitlistOnly,
  }));

  return (
    <>
      <AdminNav current="/desk" user={session} />
      <DeskClient offers={offers} session={session} />
    </>
  );
}
