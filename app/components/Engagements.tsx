import { fmtWhen, talkPhotos, type Talk } from "@/lib/content";
import { platformOf } from "@/lib/preview";
import { KIND } from "@/app/components/Features";

// Engagements as Libni's visitors meet them: a row that opens to what she
// covered and the photos from the room. Used by /speaking (by year) and by the
// Organisations, Workshops and Founders Circle pages.

function thumb(t: Talk, photos: Record<string, string>, prev: Map<string, string>): string | undefined {
  return photos[`talk_${t.id}`] || (t.url ? prev.get(t.url) : undefined);
}

export function EngagementRow({ t, photos, prev, open }: { t: Talk; photos: Record<string, string>; prev: Map<string, string>; open?: boolean }) {
  const img = thumb(t, photos, prev);
  const gallery = talkPhotos(photos, t);
  const platform = platformOf(t.url);
  const expandable = Boolean(t.details || gallery.length > 0);
  const head = (
    <>
      <span className="ed-talk-when">{fmtWhen(t.date) || "—"}{t.location ? ` · ${t.location}` : ""}</span>
      {img ? <img className="ed-talk-prev" src={img} alt="" loading="lazy" /> : t.url ? <span className="ed-talk-prev ed-talk-prev-badge"><em>{platform}</em></span> : <span className="ed-talk-prev ed-talk-prev-empty" />}
      <span>
        <h4>{t.title}</h4>
        <p>{t.org}{t.blurb ? ` — ${t.blurb}` : ""}</p>
      </span>
      <span className="ed-talk-kind">{KIND[t.kind]}{expandable ? <i className="ed-eng-chev" aria-hidden /> : t.url ? ` · ${platform} ↗` : ""}</span>
    </>
  );
  if (!expandable) {
    return t.url ? <a className="ed-talk ed-talk-rich" href={t.url} target="_blank" rel="noreferrer">{head}</a> : <div className="ed-talk ed-talk-rich">{head}</div>;
  }
  return (
    <details className="ed-eng" open={open}>
      <summary className="ed-talk ed-talk-rich">{head}</summary>
      <div className="ed-eng-body">
        {t.details && <div className="ed-eng-text">{t.details.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}</div>}
        {gallery.length > 0 && (
          <div className={`ed-eng-photos n${Math.min(gallery.length, 4)}`}>
            {gallery.map((u, i) => <img key={u + i} src={u} alt={`${t.title} — ${i + 1}`} loading="lazy" />)}
          </div>
        )}
        {t.url && <p className="ed-eng-link"><a href={t.url} target="_blank" rel="noreferrer" className="ed-link">See it on {platform} ↗</a></p>}
      </div>
    </details>
  );
}

/** The archive folded by year — only the most recent year starts open. */
export function EngagementsByYear({ talks, photos, prev }: { talks: Talk[]; photos: Record<string, string>; prev: Map<string, string> }) {
  const years = [...new Set(talks.map((t) => (t.date ?? "").slice(0, 4) || "Earlier"))];
  return (
    <div className="ed-years">
      {years.map((y, i) => {
        const rows = talks.filter((t) => ((t.date ?? "").slice(0, 4) || "Earlier") === y);
        return (
          <details key={y} className="ed-yearblock" open={i === 0}>
            <summary><span className="ed-year">{y}</span><span className="ed-year-n">{rows.length} {rows.length === 1 ? "engagement" : "engagements"}<i className="ed-eng-chev" aria-hidden /></span></summary>
            <div>{rows.map((t) => <EngagementRow key={t.id} t={t} photos={photos} prev={prev} />)}</div>
          </details>
        );
      })}
    </div>
  );
}

/** The most recent gathering as a feature — the room, when, where, what happened. */
export function LastGathering({ t, photos, prev, eyebrow = "Our last gathering" }: { t: Talk; photos: Record<string, string>; prev: Map<string, string>; eyebrow?: string }) {
  const gallery = talkPhotos(photos, t);
  const cover = gallery[0] || thumb(t, photos, prev);
  const rest = gallery.slice(1, 4);
  return (
    <div className="ed-last ed-reveal">
      {cover && <div className="ed-last-cover"><img src={cover} alt={t.title} /></div>}
      <div className="ed-last-body">
        <p className="ed-eyebrow">{eyebrow}</p>
        <h3>{t.title}</h3>
        <p className="ed-last-meta">{[fmtWhen(t.date), t.location, t.org].filter(Boolean).join(" · ")}</p>
        {(t.details || t.blurb) && <div className="ed-copy">{(t.details || t.blurb || "").split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}</div>}
        {rest.length > 0 && <div className="ed-last-strip">{rest.map((u, i) => <img key={u + i} src={u} alt="" loading="lazy" />)}</div>}
        {t.url && <p style={{ marginTop: 18 }}><a href={t.url} target="_blank" rel="noreferrer" className="ed-link">See it on {platformOf(t.url)} ↗</a></p>}
      </div>
    </div>
  );
}

/** A slow, full-bleed drift of real photos. Nothing renders until there are at least three. */
export function PhotoMarquee({ photos, rev, alt = "" }: { photos: string[]; rev?: boolean; alt?: string }) {
  const list = photos.filter(Boolean);
  if (list.length < 3) return null;
  const doubled = [...list, ...list];
  return (
    <div className="marquee ed-photo-marquee">
      <div className={`marquee-track${rev ? " rev" : ""}`}>
        {doubled.map((u, i) => <img key={u + i} src={u} alt={alt} loading="lazy" />)}
      </div>
    </div>
  );
}
