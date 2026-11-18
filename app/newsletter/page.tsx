import { SitePage } from "@/app/components/Chrome";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Letters from Libni — the newsletter",
  description: "A space to question, unlearn, and become. Personal reflections, thought-provoking perspectives, and practical insights on human behaviour, subconscious patterns, and creating a life beyond simply existing — straight to your inbox.",
};

// Libni's own Flodesk signup ("Anyway, Moving Forward" letters). It's a complete
// full-page form she designed, so we present it as the page itself, inside the
// site header/footer. Full embed URL: libnifortuna.myflodesk.com/x982sb4wue.
export default function NewsletterPage() {
  return (
    <SitePage>
      <section className="nl-wrap">
        <iframe
          className="nl-frame"
          src="https://libnifortuna.myflodesk.com/x982sb4wue"
          title="Letters from Libni — newsletter signup"
          loading="eager"
        />
      </section>
    </SitePage>
  );
}
