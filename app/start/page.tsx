import { SitePage } from "@/app/components/Chrome";
import { EdHeroSimple } from "@/app/components/Editorial";
import { listOffers } from "@/config/offers";
import StartClient from "./StartClient";

export const dynamic = "force-dynamic";

export default function StartPage() {
  const offers = listOffers()
    .filter((o) => o.track === "consumer")
    .map((o) => ({
      slug: o.slug,
      name: o.name,
      blurb: o.blurb,
      journey: o.journey,
      externalUrl: o.externalUrl ?? null,
      waitlist: o.waitlistOnly || o.pricePHP == null,
    }));
  return (
    <SitePage>
      <EdHeroSimple
        eyebrow="Find your path"
        title="Let’s find the right way in."
        lede="A few gentle questions — no wall of program names. I’ll point you to where I’d start you."
      />
      <section className="ed-sec-sm ed-ivory" style={{ paddingTop: 0 }}>
        <div className="ed-wrap ed-narrow ed-form ed-reveal" style={{ marginLeft: 0 }}>
          <StartClient offers={offers} />
        </div>
      </section>
    </SitePage>
  );
}
