import { SitePage } from "@/app/components/Chrome";
import LiberateClient from "./LiberateClient";
import { getContent } from "@/lib/content";
import { resolveVideo } from "@/config/site-slots";
import { enrichVideos } from "@/lib/vimeo";
import { DEFAULT_LIBERATE_VIDEOS, vimeoId } from "@/config/liberate-videos";

export const dynamic = "force-dynamic";

export default async function LiberatePage() {
  const { photos, videos: videoSlots, stories, liberateWords } = await getContent();
  const videoUrls = Array.from({ length: 10 }, (_, i) => videoSlots[`lib_video_${i + 1}`] ?? "").filter((u) => resolveVideo(u));
  // The curated ten always show. Studio links that resolve to a real video are added after them
  // (same Vimeo id = already in the set); raw uploads without a poster or name are skipped.
  const enriched = videoUrls.length ? await enrichVideos(videoUrls) : [];
  const known = new Set(DEFAULT_LIBERATE_VIDEOS.map((v) => vimeoId(v.url)));
  const extras = enriched.filter((v) => (v.poster || v.name) && !known.has(vimeoId(v.url)));
  const videos = [...DEFAULT_LIBERATE_VIDEOS, ...extras];
  const clips = [1, 2, 3].map((n) => videoSlots[`session_clip_${n}`] ?? "").filter((u) => resolveVideo(u)).map((src) => ({ src }));
  // Liberate's own testimonials first; then stories tagged Liberate; otherwise the featured ones from across the work.
  const tagged = stories.filter((s) => /liberate/i.test(s.program ?? ""));
  const words = liberateWords.length
    ? liberateWords.map((s) => ({ id: s.id, q: s.quote, who: s.name, role: s.role, photo: photos[`libw_${s.id}`] }))
    : (tagged.length ? tagged : stories.filter((s) => s.featured)).map((s) => ({ id: s.id, q: s.quote, who: s.name, role: s.role, photo: photos[`story_${s.id}`] }));
  return (
    <SitePage navOverlay>
      <LiberateClient photos={photos} words={words} videos={videos} clips={clips} />
    </SitePage>
  );
}
