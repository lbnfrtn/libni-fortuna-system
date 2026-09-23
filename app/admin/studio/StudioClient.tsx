"use client";

import { useRef, useState } from "react";
import type { SiteContent, MediaLink, Story, CaseStudy, Talk, PressItem, MediaKit, Brand, Keynote, BioLink } from "@/lib/content";
import { LINK_FIELDS, type SlotGroup, type Slot } from "@/config/site-slots";

export default function StudioClient({ groups, initial, storage }: { groups: SlotGroup[]; initial: SiteContent; storage: string }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [busy, setBusy] = useState<string>("");
  const [note, setNote] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  function flash(kind: "ok" | "err", text: string) {
    setNote({ kind, text });
    window.setTimeout(() => setNote(null), 4000);
  }

  async function post(body: Record<string, unknown>, label: string) {
    setBusy(label);
    try {
      const res = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Something went wrong");
      setContent(j.content);
      flash("ok", "Saved.");
    } catch (e) {
      flash("err", String(e instanceof Error ? e.message : e));
    } finally {
      setBusy("");
    }
  }

  async function upload(slotId: string, file: File) {
    setBusy(slotId);
    try {
      const fd = new FormData();
      fd.append("slotId", slotId);
      fd.append("file", file);
      const res = await fetch("/api/content/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Upload failed");
      setContent((c) => ({ ...c, photos: { ...c.photos, [slotId]: j.url } }));
      flash("ok", "Photo uploaded.");
    } catch (e) {
      flash("err", String(e instanceof Error ? e.message : e));
    } finally {
      setBusy("");
    }
  }

  return (
    <div>
      {note && (
        <div className="note" style={{ position: "sticky", top: 12, zIndex: 5, marginBottom: 20, background: note.kind === "ok" ? "var(--lilac)" : "#f6e4e4", color: note.kind === "ok" ? "var(--plum-deep)" : "#8a3b3b" }}>
          {note.text}
        </div>
      )}

      <p className="note" style={{ marginBottom: 18 }}>
        <strong>Where photos are stored:</strong> {storage}
      </p>
      <nav className="row" style={{ gap: 8, marginBottom: 34, flexWrap: "wrap" }}>
        {[["/", "↖ Site home"], ["#photos", "Photos & videos"], ["#stories", "Client stories"], ["#becoming", "The Becoming · case studies"], ["#liberatewords", "Liberate · testimonials"], ["#talks", "Events & stages"], ["#press", "Television"], ["#podcasts", "Podcast features"], ["#writeups", "Write-ups"], ["#brands", "Brands & logos"], ["#keynotes", "Signature keynotes"], ["#speakwords", "Organiser words"], ["#mediakit", "Media kit"], ["#biolinks", "Link in bio"], ["#links", "Links"], ["#events", "Events"]].map(([h, l]) => (
          <a key={h} href={h} className="chip" style={{ textDecoration: "none" }}>{l}</a>
        ))}
      </nav>
      <div id="photos" />

      {groups.map((g) => (
        <section key={g.key} style={{ marginBottom: 56 }}>
          <p className="kicker">{g.where}</p>
          <h2 style={{ fontSize: 26, margin: "6px 0 20px" }}>{g.title}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
            {g.slots.map((s) => (
              <SlotCard
                key={s.id}
                slot={s}
                photo={content.photos[s.id]}
                video={content.videos[s.id]}
                busy={busy === s.id}
                onUpload={(f) => upload(s.id, f)}
                onClear={() => post({ action: "clearPhoto", slotId: s.id }, s.id)}
                onVideo={(url) => post({ action: "setVideo", slotId: s.id, url }, s.id)}
              />
            ))}
          </div>
        </section>
      ))}

      <RowsEditor<Story>
        id="stories"
        title="Client stories"
        hint="Real words only, and only with their blessing. The quote is what shows on the home page and Client Love; the before / the work / after rows build the full story on /stories. Tick “feature” for the three you want on the home page."
        rows={content.stories}
        photos={content.photos}
        photoPrefix="story"
        photoHint="Their photo — shown as a small circle beside their words."
        blank={() => ({ id: `s-${Date.now().toString(36)}`, name: "", quote: "", featured: false })}
        fields={[
          { key: "name", label: "Name" }, { key: "role", label: "Who they are (e.g. Actor · Mother)" }, { key: "program", label: "Program (Essence Retreat, Liberate, 1:1…)" },
          { key: "featured", label: "Feature on the home page", type: "checkbox" },
          { key: "quote", label: "Their words", type: "textarea", full: true },
          { key: "before", label: "Where they started", type: "textarea" }, { key: "during", label: "The work", type: "textarea" }, { key: "after", label: "Where they are now", type: "textarea" },
        ]}
        busy={busy === "stories"}
        onSave={(items) => post({ action: "setStories", items }, "stories")}
        onUpload={upload}
        onClear={(slotId) => post({ action: "clearPhoto", slotId }, slotId)}
      />

      <RowsEditor<CaseStudy>
        id="becoming"
        title="The Becoming · case studies & testimonies"
        hint="Only on the Becoming page, separate from the client stories above. Fill in “Where she started”, “The work” and “Where she is now” and it becomes a full case-study chapter with the photo, the headline and the quote. Leave those three empty and it joins the testimony wall underneath. Rows show in this order — put your strongest first. Paste a YouTube link and their video plays inside their chapter."
        rows={content.becomingStories}
        photos={content.photos}
        photoPrefix="case"
        photoHint="Their portrait — 4:5, at least 1200px wide. Shown large in the chapter, small on the wall."
        blank={() => ({ id: `c-${Date.now().toString(36)}`, name: "", quote: "" })}
        fields={[
          { key: "name", label: "Name" }, { key: "role", label: "Who they are (e.g. Founder · Mother of two)" },
          { key: "headline", label: "The result in one line (e.g. From panic attacks to leading her own team)", full: true },
          { key: "quote", label: "Their words", type: "textarea", full: true },
          { key: "before", label: "Where she started", type: "textarea" }, { key: "during", label: "The work we did", type: "textarea" }, { key: "after", label: "Where she is now", type: "textarea" },
          { key: "video", label: "Video testimony (YouTube or Vimeo link, optional)", placeholder: "https://youtube.com/watch?v=…", full: true },
        ]}
        busy={busy === "becoming"}
        onSave={(items) => post({ action: "setBecomingStories", items }, "becoming")}
        onUpload={upload}
        onClear={(slotId) => post({ action: "clearPhoto", slotId }, slotId)}
      />

      <RowsEditor<Story>
        id="liberatewords"
        title="Liberate · testimonials"
        hint="Only on the Liberate page, from real Liberate students. The quote shows in the words section; the photo can be their portrait or a screenshot of their message. Whole-screen screenshots of messages go in the Liberate photo group above (“Testimonial screenshots”)."
        rows={content.liberateWords}
        photos={content.photos}
        photoPrefix="libw"
        photoHint="Their portrait, or a screenshot of their message."
        blank={() => ({ id: `lw-${Date.now().toString(36)}`, name: "", quote: "" })}
        fields={[{ key: "name", label: "Name" }, { key: "role", label: "Who they are · which Liberate cohort" }, { key: "quote", label: "Their words", type: "textarea" }]}
        busy={busy === "liberatewords"}
        onSave={(items) => post({ action: "setLiberateWords", items }, "liberatewords")}
        onUpload={upload}
        onClear={(slotId) => post({ action: "clearPhoto", slotId }, slotId)}
      />

      <RowsEditor<Talk>
        id="talks"
        title="Events & stages"
        hint="Keynotes, workshops, panels, summits, retreats and facilitations — the engagement archive on /speaking, grouped by year. TV, podcasts and articles have their own sections below. Dates can be a year (2024), a month (2026-10), a day (2026-10-07) or a span (2021–2023); anything in the future shows under “Coming up”."
        rows={content.talks}
        photos={content.photos}
        photoPrefix="talk"
        photoHint="Optional — a photo from that stage."
        blank={() => ({ id: `t-${Date.now().toString(36)}`, title: "", org: "", kind: "keynote" })}
        fields={[
          { key: "title", label: "Talk title" }, { key: "org", label: "Event / organisation" },
          { key: "date", label: "Date (YYYY, YYYY-MM or YYYY-MM-DD)", placeholder: "2026-10-07" }, { key: "location", label: "City / venue" },
          { key: "kind", label: "Type", type: "select", options: [["keynote", "Keynote"], ["workshop", "Workshop"], ["panel", "Panel"], ["summit", "Summit"], ["retreat", "Retreat"], ["other", "Other"]] },
          { key: "url", label: "Link — YouTube, Spotify, TikTok and news links get a preview image automatically; Facebook/Instagram show a badge until you add a photo below", placeholder: "https://…" },
          { key: "blurb", label: "One line about it", full: true },
        ]}
        busy={busy === "talks"}
        onSave={(items) => post({ action: "setTalks", items }, "talks")}
        onUpload={upload}
        onClear={(slotId) => post({ action: "clearPhoto", slotId }, slotId)}
      />

      {([
        { id: "press", title: "Television & video features", kinds: ["tv", "video"] as PressItem["kind"][], hint: "TV segments and video features about you. Shown as cards on /speaking. Paste a YouTube link for an automatic preview; Facebook needs a photo below." },
        { id: "podcasts", title: "Podcast features", kinds: ["podcast"] as PressItem["kind"][], hint: "Other people’s podcasts you’ve been a guest on. Shown on /speaking and under “Libni as a guest” on /podcast. YouTube and Spotify links preview automatically." },
        { id: "writeups", title: "Write-ups & press", kinds: ["article"] as PressItem["kind"][], hint: "Articles and features in print and online. Shown on /speaking and the media kit. Most news links preview automatically." },
      ]).map((sec) => (
        <RowsEditor<PressItem>
          key={sec.id}
          id={sec.id}
          title={sec.title}
          hint={sec.hint}
          rows={content.press.filter((p) => sec.kinds.includes(p.kind))}
          photos={content.photos}
          photoPrefix="press"
          photoHint="Optional — a still, the show’s artwork or a screenshot of the article."
          blank={() => ({ id: `p-${Date.now().toString(36)}`, title: "", outlet: "", url: "", kind: sec.kinds[0] })}
          fields={[
            { key: "title", label: sec.id === "writeups" ? "Article title" : "Episode / segment title" }, { key: "outlet", label: sec.id === "writeups" ? "Publication" : "Show / channel" },
            { key: "url", label: "Link", placeholder: "https://…" }, { key: "date", label: "Date (YYYY-MM-DD)", placeholder: "2026-03-14" },
            ...(sec.kinds.length > 1 ? [{ key: "kind" as const, label: "Type", type: "select" as const, options: [["tv", "TV"], ["video", "Video"]] as [string, string][] }] : []),
            { key: "blurb", label: "One line about it" },
            { key: "featured", label: "Home page order (1, 2, 3… · blank = not on the home page)", placeholder: "e.g. 1" },
          ]}
          busy={busy === sec.id}
          onSave={(items) => post({ action: "setPress", items: [...content.press.filter((p) => !sec.kinds.includes(p.kind)), ...items] }, sec.id)}
          onUpload={upload}
          onClear={(slotId) => post({ action: "clearPhoto", slotId }, slotId)}
        />
      ))}

      <RowsEditor<Brand>
        id="brands"
        title="Brands, organisations & outlets"
        hint="Everyone you’ve worked with or been featured by. Upload a logo (PNG with transparent background is best) and it joins the scrolling row on /speaking; names without a logo appear as a line of text underneath."
        rows={content.brands}
        photos={content.photos}
        photoPrefix="brand"
        photoHint="Logo."
        blank={() => ({ id: `b-${Date.now().toString(36)}`, name: "" })}
        fields={[{ key: "name", label: "Name" }, { key: "url", label: "Website (optional)", placeholder: "https://…" }]}
        busy={busy === "brands"}
        onSave={(items) => post({ action: "setBrands", items }, "brands")}
        onUpload={upload}
        onClear={(slotId) => post({ action: "clearPhoto", slotId }, slotId)}
      />

      <RowsEditor<Keynote>
        id="keynotes"
        title="Signature keynotes"
        hint="The experiences organisers can book. Shown on /speaking and as topics in the media kit."
        rows={content.keynotes}
        photos={content.photos}
        blank={() => ({ id: `k-${Date.now().toString(36)}`, category: "", title: "", blurb: "" })}
        fields={[{ key: "title", label: "Title" }, { key: "category", label: "Category (e.g. Leadership)" }, { key: "blurb", label: "What it does for the room", type: "textarea" }]}
        busy={busy === "keynotes"}
        onSave={(items) => post({ action: "setKeynotes", items }, "keynotes")}
        onUpload={upload}
        onClear={(slotId) => post({ action: "clearPhoto", slotId }, slotId)}
      />

      <RowsEditor<Story>
        id="speakwords"
        title="Words from organisers & audiences"
        hint="What event organisers, HR leads and participants said after a talk or workshop. Shown on /speaking above the messages collage."
        rows={content.speakingWords}
        photos={content.photos}
        photoPrefix="speak"
        photoHint="Their photo or the company logo."
        blank={() => ({ id: `w-${Date.now().toString(36)}`, name: "", quote: "" })}
        fields={[{ key: "name", label: "Name" }, { key: "role", label: "Role · company / event" }, { key: "quote", label: "What they said", type: "textarea" }]}
        busy={busy === "speakwords"}
        onSave={(items) => post({ action: "setSpeakingWords", items }, "speakwords")}
        onUpload={upload}
        onClear={(slotId) => post({ action: "clearPhoto", slotId }, slotId)}
      />

      <RowsEditor<BioLink>
        id="biolinks"
        title="Link in bio — /links"
        hint="The page to paste into your Instagram bio: libni.co/links. Rows show in this order. Links can be pages on this site (/speaking) or full URLs."
        rows={content.bioLinks}
        photos={content.photos}
        blank={() => ({ id: `l-${Date.now().toString(36)}`, label: "", href: "" })}
        fields={[{ key: "label", label: "Button text" }, { key: "note", label: "Small line under it (optional)" }, { key: "href", label: "Goes to", placeholder: "/speaking or https://…" }]}
        busy={busy === "biolinks"}
        onSave={(items) => post({ action: "setBioLinks", items }, "biolinks")}
        onUpload={upload}
        onClear={(slotId) => post({ action: "clearPhoto", slotId }, slotId)}
      />

      <MediaKitEditor initial={content.mediaKit} busy={busy === "mediakit"} onSave={(mediaKit) => post({ action: "setMediaKit", mediaKit }, "mediakit")} />

      <section id="links" style={{ marginBottom: 56, paddingTop: 40, borderTop: "1px solid var(--line)" }}>
        <h2 style={{ fontSize: 26, marginBottom: 6 }}>Your links</h2>
        <p className="muted" style={{ marginBottom: 20 }}>Paste once and the right things appear on the site.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
          {LINK_FIELDS.map((f) => (
            <LinkEditor
              key={f.key}
              field={f}
              value={content.links[f.key] ?? ""}
              busy={busy === `link-${f.key}`}
              onSave={(url) => post({ action: "setLink", key: f.key, url }, `link-${f.key}`)}
            />
          ))}
        </div>
      </section>

      <ListEditor
        title="Podcast episodes"
        hint="Optional. If you paste your Spotify show above, the player already lists your latest episodes — add rows here only to feature specific ones."
        items={content.podcast}
        busy={busy === "podcast"}
        onSave={(items) => post({ action: "setList", key: "podcast", items }, "podcast")}
      />

      <div id="events" />
      <ListEditor
        title="Upcoming events"
        hint="Workshops, circles and retreats with dates. Shown on Experiences and linked from the home page. Hidden until you add the first one."
        items={content.events}
        busy={busy === "events"}
        onSave={(items) => post({ action: "setList", key: "events", items }, "events")}
      />

      <ListEditor
        title="Write-ups & letters"
        hint="Your Substack posts and essays. The home-page section stays hidden until you add the first one."
        items={content.writings}
        busy={busy === "writings"}
        onSave={(items) => post({ action: "setList", key: "writings", items }, "writings")}
      />
    </div>
  );
}

type Field<T> = { key: keyof T & string; label: string; type?: "text" | "textarea" | "select" | "checkbox"; options?: [string, string][]; placeholder?: string; full?: boolean };

/** One editor for any list of structured rows (stories, talks, press), each row with an optional photo. */
function RowsEditor<T extends { id: string }>({ id, title, hint, rows: initial, fields, photos, photoPrefix, photoHint = "", blank, busy, onSave, onUpload, onClear }: {
  id: string; title: string; hint: string; rows: T[]; fields: Field<T>[]; photos: Record<string, string>; photoPrefix?: string; photoHint?: string;
  blank: () => T; busy: boolean; onSave: (rows: T[]) => void; onUpload: (slotId: string, f: File) => void; onClear: (slotId: string) => void;
}) {
  const [rows, setRows] = useState<T[]>(initial);
  const [open, setOpen] = useState<string | null>(null);
  function set(i: number, key: keyof T, value: unknown) { setRows((r) => r.map((row, n) => (n === i ? { ...row, [key]: value } : row))); }
  const label = (row: T) => String((row as Record<string, unknown>).name ?? (row as Record<string, unknown>).title ?? "") || "Untitled";

  return (
    <section id={id} style={{ marginBottom: 56, paddingTop: 40, borderTop: "1px solid var(--line)" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div><h2 style={{ fontSize: 26, marginBottom: 6 }}>{title} <span className="muted" style={{ fontSize: 15 }}>· {rows.length}</span></h2><p className="muted" style={{ marginBottom: 20, maxWidth: "70ch" }}>{hint}</p></div>
        <button className="btn small" disabled={busy} onClick={() => onSave(rows)}>{busy ? "Saving…" : "Save"}</button>
      </div>

      {rows.map((row, i) => {
        const slotId = `${photoPrefix ?? "x"}_${row.id}`;
        const photo = photoPrefix ? photos[slotId] || (row as Record<string, unknown>).logo as string | undefined : undefined;
        const isOpen = open === row.id || !label(row).trim() || label(row) === "Untitled";
        return (
          <div key={row.id} className="card" style={{ marginBottom: 10, padding: 0 }}>
            <button type="button" onClick={() => setOpen(isOpen ? "" : row.id)} style={{ all: "unset", cursor: "pointer", display: "flex", gap: 14, alignItems: "center", width: "100%", padding: "14px 18px", boxSizing: "border-box" }}>
              {photo ? <img src={photo} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} /> : <span style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--linen)", display: "inline-block" }} />}
              <strong style={{ flex: 1 }}>{label(row)}</strong>
              <span className="muted" style={{ fontSize: 12 }}>{isOpen ? "Close" : "Edit"}</span>
            </button>
            {isOpen && (
              <div style={{ padding: "0 18px 18px" }}>
                <div className="grid2">
                  {fields.map((f) => (
                    <div key={f.key} style={f.full || f.type === "textarea" ? { gridColumn: "1 / -1" } : undefined}>
                      {f.type === "checkbox" ? (
                        <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 26 }}>
                          <input type="checkbox" checked={Boolean(row[f.key])} onChange={(e) => set(i, f.key, e.target.checked)} style={{ width: "auto", accentColor: "var(--plum)" }} /> {f.label}
                        </label>
                      ) : f.type === "select" ? (
                        <><label>{f.label}</label><select value={String(row[f.key] ?? "")} onChange={(e) => set(i, f.key, e.target.value)}>{f.options?.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></>
                      ) : f.type === "textarea" ? (
                        <><label>{f.label}</label><textarea rows={3} value={String(row[f.key] ?? "")} placeholder={f.placeholder} onChange={(e) => set(i, f.key, e.target.value)} /></>
                      ) : (
                        <><label>{f.label}</label><input value={String(row[f.key] ?? "")} placeholder={f.placeholder} onChange={(e) => set(i, f.key, e.target.value)} /></>
                      )}
                    </div>
                  ))}
                </div>
                {photoPrefix && <RowPhoto slotId={slotId} photo={photo} hint={photoHint} onUpload={(f) => onUpload(slotId, f)} onClear={() => onClear(slotId)} />}
                <div className="row" style={{ marginTop: 14, justifyContent: "space-between" }}>
                  <div className="row">
                    <button type="button" className="btn small ghost" disabled={i === 0} onClick={() => setRows((r) => { const c = [...r]; [c[i - 1], c[i]] = [c[i], c[i - 1]]; return c; })}>Move up</button>
                    <button type="button" className="btn small ghost" disabled={i === rows.length - 1} onClick={() => setRows((r) => { const c = [...r]; [c[i + 1], c[i]] = [c[i], c[i + 1]]; return c; })}>Move down</button>
                  </div>
                  <button type="button" className="btn small ghost" onClick={() => setRows((r) => r.filter((_, n) => n !== i))}>Remove</button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="row" style={{ marginTop: 14 }}>
        <button type="button" className="btn small ghost" onClick={() => { const b = blank(); setRows((r) => [...r, b]); setOpen(b.id); }}>Add another</button>
        <button className="btn small" disabled={busy} onClick={() => onSave(rows)}>{busy ? "Saving…" : "Save"}</button>
      </div>
      <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>Photos save the moment you upload them; everything else saves when you press Save.</p>
    </section>
  );
}

function RowPhoto({ slotId, photo, hint, onUpload, onClear }: { slotId: string; photo?: string; hint: string; onUpload: (f: File) => void; onClear: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="row" style={{ marginTop: 14, alignItems: "center" }}>
      {photo ? <img src={photo} alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} /> : <span style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--linen)", display: "inline-block" }} />}
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/avif" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }} />
      <button type="button" className="btn small ghost" onClick={() => ref.current?.click()}>{photo ? "Replace photo" : "Add photo"}</button>
      {photo && <button type="button" className="btn small ghost" onClick={onClear}>Remove photo</button>}
      <span className="muted" style={{ fontSize: 12 }}>{hint} <code style={{ fontSize: 10 }}>{slotId}</code></span>
    </div>
  );
}

function MediaKitEditor({ initial, busy, onSave }: { initial: MediaKit; busy: boolean; onSave: (m: MediaKit) => void }) {
  const [m, setM] = useState<MediaKit>(initial);
  return (
    <section id="mediakit" style={{ marginBottom: 56, paddingTop: 40, borderTop: "1px solid var(--line)" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div><h2 style={{ fontSize: 26, marginBottom: 6 }}>Media kit</h2><p className="muted" style={{ marginBottom: 20, maxWidth: "70ch" }}>What organisers and press copy from /media-kit. Headshots are in the photo section above.</p></div>
        <button className="btn small" disabled={busy} onClick={() => onSave(m)}>{busy ? "Saving…" : "Save"}</button>
      </div>
      <div className="card">
        <label>One line</label><input value={m.oneLiner} onChange={(e) => setM({ ...m, oneLiner: e.target.value })} />
        <label>Short bio (introductions)</label><textarea rows={4} value={m.shortBio} onChange={(e) => setM({ ...m, shortBio: e.target.value })} />
        <label>Long bio</label><textarea rows={9} value={m.longBio} onChange={(e) => setM({ ...m, longBio: e.target.value })} />
        <label>Speaking topics — one per line</label><textarea rows={6} value={m.topics.join("\n")} onChange={(e) => setM({ ...m, topics: e.target.value.split("\n") })} />
        <label>Press &amp; bookings email</label><input value={m.pressEmail} onChange={(e) => setM({ ...m, pressEmail: e.target.value })} />
        <div className="row" style={{ marginTop: 16 }}><button className="btn small" disabled={busy} onClick={() => onSave(m)}>{busy ? "Saving…" : "Save media kit"}</button><a className="btn small ghost" href="/media-kit" target="_blank" rel="noreferrer">Preview</a></div>
      </div>
    </section>
  );
}

function SlotCard({ slot, photo, video, busy, onUpload, onClear, onVideo }: {
  slot: Slot; photo?: string; video?: string; busy: boolean;
  onUpload: (f: File) => void; onClear: () => void; onVideo: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(video ?? "");
  const isVideo = slot.kind === "video";
  const shown = photo || slot.fallback;

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ aspectRatio: slot.aspect, background: "var(--linen)", marginBottom: 12, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isVideo ? (
          <span className="muted" style={{ fontSize: 12, textAlign: "center", padding: 10 }}>{video ? "Video link set" : "No video yet"}</span>
        ) : shown ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={shown} alt={slot.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span className="muted" style={{ fontSize: 12, textAlign: "center", padding: 10 }}>Empty — nothing shows on the site</span>
        )}
      </div>

      <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>{slot.label}</p>
      <p className="muted" style={{ fontSize: 12, margin: "0 0 10px" }}>{slot.hint}</p>

      {isVideo ? (
        <>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=…" style={{ fontSize: 13 }} />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn small" disabled={busy} onClick={() => onVideo(url)}>{busy ? "Saving…" : "Save link"}</button>
            {video && <button className="btn small ghost" disabled={busy} onClick={() => { setUrl(""); onVideo(""); }}>Remove</button>}
          </div>
        </>
      ) : (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }}
          />
          <div className="row">
            <button className="btn small" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? "Uploading…" : photo ? "Replace photo" : "Upload photo"}
            </button>
            {photo && <button className="btn small ghost" disabled={busy} onClick={onClear}>Remove</button>}
          </div>
          {!photo && slot.fallback && <p className="muted" style={{ fontSize: 11, marginTop: 8 }}>Currently showing a photo already on the site.</p>}
        </>
      )}
    </div>
  );
}

function LinkEditor({ field, value, busy, onSave }: {
  field: { key: string; label: string; hint: string; placeholder: string }; value: string; busy: boolean; onSave: (url: string) => void;
}) {
  const [url, setUrl] = useState(value);
  return (
    <div className="card" style={{ padding: 16 }}>
      <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>{field.label}</p>
      <p className="muted" style={{ fontSize: 12, margin: "0 0 10px" }}>{field.hint}</p>
      <input value={url} placeholder={field.placeholder} onChange={(e) => setUrl(e.target.value)} style={{ fontSize: 13 }} />
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn small" disabled={busy} onClick={() => onSave(url)}>{busy ? "Saving…" : "Save"}</button>
        {value && <button className="btn small ghost" disabled={busy} onClick={() => { setUrl(""); onSave(""); }}>Remove</button>}
      </div>
    </div>
  );
}

function ListEditor({ title, hint, items, busy, onSave }: {
  title: string; hint: string; items: MediaLink[]; busy: boolean; onSave: (items: MediaLink[]) => void;
}) {
  const [rows, setRows] = useState<MediaLink[]>(items.length ? items : []);

  function set(i: number, patch: Partial<MediaLink>) {
    setRows((r) => r.map((row, n) => (n === i ? { ...row, ...patch } : row)));
  }

  return (
    <section style={{ marginBottom: 56, paddingTop: 40, borderTop: "1px solid var(--line)" }}>
      <h2 style={{ fontSize: 26, marginBottom: 6 }}>{title}</h2>
      <p className="muted" style={{ marginBottom: 20 }}>{hint}</p>

      {rows.map((row, i) => (
        <div key={row.id} className="card" style={{ marginBottom: 12, padding: 16 }}>
          <div className="grid2">
            <div><label>Title</label><input value={row.title} onChange={(e) => set(i, { title: e.target.value })} /></div>
            <div><label>Date (optional)</label><input value={row.date ?? ""} placeholder="Sep 2026" onChange={(e) => set(i, { date: e.target.value })} /></div>
          </div>
          <label>Link</label>
          <input value={row.url} placeholder="https://…" onChange={(e) => set(i, { url: e.target.value })} />
          <label>One line about it (optional)</label>
          <input value={row.blurb ?? ""} onChange={(e) => set(i, { blurb: e.target.value })} />
          <button className="btn small ghost" style={{ marginTop: 12 }} onClick={() => setRows((r) => r.filter((_, n) => n !== i))}>Remove</button>
        </div>
      ))}

      <div className="row" style={{ marginTop: 14 }}>
        <button className="btn small ghost" onClick={() => setRows((r) => [...r, { id: `${title}-${Date.now()}`, title: "", url: "" }])}>Add another</button>
        <button className="btn small" disabled={busy} onClick={() => onSave(rows)}>{busy ? "Saving…" : "Save"}</button>
      </div>
    </section>
  );
}
