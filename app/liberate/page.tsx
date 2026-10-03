import { SitePage } from "@/app/components/Chrome";
import LiberateClient from "./LiberateClient";
import { getContent } from "@/lib/content";
import { resolveVideo } from "@/config/site-slots";

export const dynamic = "force-dynamic";

export default async function LiberatePage() {
  const { photos, videos: videoSlots, stories, liberateWords } = await getContent();
  const videos = [1, 2, 3, 4].map((n) => videoSlots[`lib_video_${n}`] ?? "").filter((u) => resolveVideo(u)).map((url) => ({ url }));
  // Liberate's own testimonials first; then stories tagged Liberate; otherwise the featured ones from across the work.
  const tagged = stories.filter((s) => /liberate/i.test(s.program ?? ""));
  const words = liberateWords.length
    ? liberateWords.map((s) => ({ id: s.id, q: s.quote, who: s.name, role: s.role, photo: photos[`libw_${s.id}`] }))
    : (tagged.length ? tagged : stories.filter((s) => s.featured)).map((s) => ({ id: s.id, q: s.quote, who: s.name, role: s.role, photo: photos[`story_${s.id}`] }));
  return (
    <SitePage navOverlay>
      <LiberateClient photos={photos} words={words} videos={videos} />
    </SitePage>
  );
}
