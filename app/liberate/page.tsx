import { SitePage } from "@/app/components/Chrome";
import LiberateClient from "./LiberateClient";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function LiberatePage() {
  const { photos, stories, liberateWords } = await getContent();
  // Liberate's own testimonials first; then stories tagged Liberate; otherwise the featured ones from across the work.
  const tagged = stories.filter((s) => /liberate/i.test(s.program ?? ""));
  const words = liberateWords.length
    ? liberateWords.map((s) => ({ q: s.quote, who: s.name, role: s.role, photo: photos[`libw_${s.id}`] }))
    : (tagged.length ? tagged : stories.filter((s) => s.featured)).map((s) => ({ q: s.quote, who: s.name, role: s.role, photo: photos[`story_${s.id}`] }));
  return (
    <SitePage navOverlay>
      <LiberateClient photos={photos} words={words} />
    </SitePage>
  );
}
