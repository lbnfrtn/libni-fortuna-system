import { fmtWhen, type Talk, type PressItem } from "@/lib/content";
import { platformOf } from "@/lib/preview";

// Shared building blocks for everywhere Libni's features appear: /features,
// /speaking, the home page and the media kit. Previews come from
// lib/preview (YouTube / Spotify / TikTok / og:image) or her own upload.

export const KIND: Record<Talk["kind"], string> = { keynote: "Keynote", workshop: "Workshop", panel: "Panel", summit: "Summit", retreat: "Retreat", other: "Event" };
export const PRESS_KIND: Record<PressItem["kind"], string> = { tv: "Television", podcast: "Podcast", video: "Video", article: "Press" };

export function TalkRow({ t, photos, prev }: { t: Talk; photos: Record<string, string>; prev: Map<string, string> }) {
  const img = photos[`talk_${t.id}`] || (t.url ? prev.get(t.url) : undefined);
  const platform = platformOf(t.url);
  const inner = (
    <>
      <span className="ed-talk-when">{fmtWhen(t.date) || "—"}{t.location ? ` · ${t.location}` : ""}</span>
      {img ? <img className="ed-talk-prev" src={img} alt="" loading="lazy" /> : t.url ? <span className="ed-talk-prev ed-talk-prev-badge"><em>{platform}</em></span> : <span className="ed-talk-prev ed-talk-prev-empty" />}
      <span>
        <h4>{t.title}</h4>
        <p>{t.org}{t.blurb ? ` — ${t.blurb}` : ""}</p>
      </span>
      <span className="ed-talk-kind">{KIND[t.kind]}{t.url ? ` · ${platform} ↗` : ""}</span>
    </>
  );
  return t.url ? <a className="ed-talk ed-talk-rich" href={t.url} target="_blank" rel="noreferrer">{inner}</a> : <div className="ed-talk ed-talk-rich">{inner}</div>;
}

export function PressCard({ p, photos, prev }: { p: PressItem; photos: Record<string, string>; prev: Map<string, string> }) {
  const thumb = photos[`press_${p.id}`] || (p.url ? prev.get(p.url) : undefined);
  const platform = platformOf(p.url);
  const inner = (
    <>
      <div className={`ed-press-thumb${thumb ? " has-img" : ""}`}>{thumb ? <img src={thumb} alt="" loading="lazy" /> : <em>{p.outlet}{platform ? <small>{platform} ↗</small> : null}</em>}</div>
      <div><b>{p.outlet}</b><h4>{p.title}</h4><span>{PRESS_KIND[p.kind]}{p.date ? ` · ${fmtWhen(p.date)}` : ""}{platform ? ` · ${platform}` : ""}</span></div>
    </>
  );
  return p.url ? <a className="ed-press-card" href={p.url} target="_blank" rel="noreferrer">{inner}</a> : <div className="ed-press-card">{inner}</div>;
}

export function PressRow({ p, photos, prev }: { p: PressItem; photos: Record<string, string>; prev: Map<string, string> }) {
  const img = photos[`press_${p.id}`] || (p.url ? prev.get(p.url) : undefined);
  const inner = (
    <>
      <span className="ed-talk-when">{p.outlet}</span>
      {img ? <img className="ed-talk-prev" src={img} alt="" loading="lazy" /> : <span className="ed-talk-prev ed-talk-prev-badge"><em>{p.outlet}</em></span>}
      <span><h4>{p.title}</h4>{p.date && <p>{fmtWhen(p.date)}</p>}</span>
      <span className="ed-talk-kind">{p.url ? "Read ↗" : "Press"}</span>
    </>
  );
  return p.url ? <a className="ed-talk ed-talk-rich" href={p.url} target="_blank" rel="noreferrer">{inner}</a> : <div className="ed-talk ed-talk-rich">{inner}</div>;
}
