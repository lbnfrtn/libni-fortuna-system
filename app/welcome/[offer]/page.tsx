import { store } from "@/lib/store";
import WelcomeClient from "./WelcomeClient";
import { SitePage } from "@/app/components/Chrome";
import { getOffer } from "@/config/offers";

export const dynamic = "force-dynamic";

export default async function WelcomePage({ params }: { params: Promise<{ offer: string }> }) {
  const { offer } = await params;
  const offerConfig = getOffer(offer);

  if (!offerConfig) {
    return (
      <SitePage>
        <div className="wrap" style={{ paddingTop: 100, textAlign: "center" }}>
          <h1>Offer Not Found</h1>
        </div>
      </SitePage>
    );
  }

  return (
    <SitePage>
      <WelcomeClient offer={offerConfig} />
    </SitePage>
  );
}
