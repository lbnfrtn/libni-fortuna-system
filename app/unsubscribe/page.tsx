import { SitePage } from "@/app/components/Chrome";
import { unsubscribe } from "@/lib/funnel";
import { unsubscribeTokenValid } from "@/lib/mail";

export const dynamic = "force-dynamic";

// The link at the bottom of every letter. Signed, so it only works for the address it was sent to.
export default async function Unsubscribe({ searchParams }: { searchParams: Promise<{ e?: string; t?: string }> }) {
  const { e = "", t = "" } = await searchParams;
  const valid = Boolean(e) && unsubscribeTokenValid(e, t);
  if (valid) await unsubscribe(e);
  return (
    <SitePage>
      <section className="ed-hero-simple">
        <div className="ed-wrap" style={{ maxWidth: 720 }}>
          <p className="ed-eyebrow">Letters from Libni</p>
          {valid ? (
            <>
              <h1 className="ed-display" style={{ marginTop: 18 }}>You&rsquo;re unsubscribed.</h1>
              <p className="ed-lede" style={{ maxWidth: "30ch" }}>No more letters to {e}. No hard feelings — and the door stays open.</p>
            </>
          ) : (
            <>
              <h1 className="ed-display" style={{ marginTop: 18 }}>That link didn&rsquo;t work.</h1>
              <p className="ed-lede" style={{ maxWidth: "32ch" }}>Reply to any letter with &ldquo;unsubscribe&rdquo; and it&rsquo;s done — a real person reads it.</p>
            </>
          )}
        </div>
      </section>
    </SitePage>
  );
}
