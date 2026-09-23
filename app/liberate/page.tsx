import { SitePage } from "@/app/components/Chrome";
import LiberateClient from "./LiberateClient";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function LiberatePage() {
  const { photos, stories } = await getContent();
  // Stories tagged for Liberate first; otherwise the featured ones from across the work.
  const tagged = stories.filter((s) => /liberate/i.test(s.program ?? ""));
  const words = (tagged.length ? tagged : stories.filter((s) => s.featured)).map((s) => ({ q: s.quote, who: s.name, role: s.role }));
  return (
    <SitePage navOverlay>
      <LiberateClient photos={photos} words={words} />
    </SitePage>
  );
}
