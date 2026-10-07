"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import "./studio.css";
import type { SiteContent, MediaLink, Story, CaseStudy, Talk, PressItem, MediaKit, Brand, Keynote, BioLink } from "@/lib/content";
import { PROGRAM_OPTIONS, TALK_SURFACES } from "@/config/content-options";
import { LINK_FIELDS, type SlotGroup, type Slot } from "@/config/site-slots";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/heic";
const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime,video/x-m4v";

type Panel = { id: string; label: string; sub?: string; icon: IconName; count?: number; render: () => ReactNode };
type Section = { title: string; panels: Panel[] };

const GROUP_ICON: Record<string, IconName> = {
  home: "home", videos: "video", screenshots: "chat", oneonone: "heart",
  about: "person", becoming: "sparkle", liberate: "sun",
  programs: "star", links: "link", speaking: "mic", mediakit: "kit",
};

/** First "/path" mentioned in a group's location string, else the home page. */
function liveFor(where: string): string {
  const m = where.match(/\/[a-z0-9-]+/i);
  return m ? m[0] : "/";
}

export default function StudioClient({ groups, initial, storage, direct }: { groups: SlotGroup[]; initial: SiteContent; storage: string; direct: boolean }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [busy, setBusy] = useState<string>("");
  const [progress, setProgress] = useState<number | null>(null);
  const [note, setNote] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [active, setActive] = useState<string>(groups.length ? `g-${groups[0].key}` : "stories");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"menu" | "panel">("menu"); // mobile only

  function flash(kind: "ok" | "err", text: string, ms = 4000) {
    setNote({ kind, text });
    window.setTimeout(() => setNote(null), ms);
  }

  // A 401 means the sign-in cookie has expired (the page can stay open longer than the session).
  function expired(): never {
    flash("err", "Your sign-in has expired. Taking you back to the sign-in screen…", 8000);
    window.setTimeout(() => window.location.reload(), 1500);
    throw new Error("Signed out");
  }

  async function post(body: Record<string, unknown>, label: string) {
    setBusy(label);
    try {
      const res = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.status === 401) expired();
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Something went wrong");
      setContent(j.content);
      flash("ok", "Saved.");
    } catch (e) {
      if (!(e instanceof Error && e.message === "Signed out")) flash("err", String(e instanceof Error ? e.message : e));
    } finally {
      setBusy("");
    }
  }

  /** Photos and video files. In production the file goes straight from the browser to Vercel Blob, so size isn't capped by the server. */
  async function upload(slotId: string, file: File, kind: "photo" | "video" = "photo") {
    setBusy(slotId);
    setProgress(0);
    try {
      const isVideo = file.type.startsWith("video/");
      const maxMB = isVideo ? 500 : 25;
      if (file.size > maxMB * 1024 * 1024) throw new Error(`That file is larger than ${maxMB}MB. Please export a smaller version.`);
      if (kind === "video" && !isVideo) throw new Error("Please choose an MP4 or MOV video file.");
      if (kind === "photo" && isVideo) throw new Error("This slot takes a photo. Video slots are in the Videos group.");

      let url: string;
      // Files the server route can still swallow if the direct path is unavailable (Vercel's request limit is 4.5MB).
      const smallEnoughForServer = file.size <= 4 * 1024 * 1024;
      let viaDirect = direct;
      let directError = "";
      if (direct) {
        try {
          // First ask our route whether it is signed in — a plain 401 here means the session expired, not a storage problem.
          const probe = await fetch("/api/content/upload/client", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "probe" }) });
          if (probe.status === 401) expired();
          const { uploadPresigned } = await import("@vercel/blob/client");
          const ext = (file.name.split(".").pop() || (isVideo ? "mp4" : "jpg")).toLowerCase().replace(/[^a-z0-9]/g, "");
          const blob = await uploadPresigned(`site/${slotId}-${Date.now()}.${ext}`, file, {
            access: "public",
            handleUploadUrl: "/api/content/upload/client",
            clientPayload: JSON.stringify({ slotId }),
            contentType: file.type,
            onUploadProgress: (p) => setProgress(Math.round(p.percentage)),
          });
          url = blob.url;
          const res = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "setUpload", slotId, url, kind }) });
          if (res.status === 401) expired();
          const j = await res.json();
          if (!j.ok) throw new Error(j.error || "Upload saved to storage but not to the site. Try again.");
          setContent(j.content);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          if (msg === "Signed out") throw e;
          if (!smallEnoughForServer) throw new Error(`Direct upload failed (${msg}). Please tell Libni's developer this exact message.`);
          // Small file: fall back to the server route so the photo still lands.
          viaDirect = false;
          directError = msg;
        }
      }
      if (!viaDirect) {
        const fd = new FormData();
        fd.append("slotId", slotId);
        fd.append("file", file);
        const res = await fetch("/api/content/upload", { method: "POST", body: fd });
        if (res.status === 401) expired();
        if (res.status === 413) throw new Error("That file is too large for this connection. Try a smaller export.");
        const j = await res.json();
        if (!j.ok) throw new Error(j.error || "Upload failed");
        url = j.url;
        setContent((c) => kind === "video" ? { ...c, videos: { ...c.videos, [slotId]: url } } : { ...c, photos: { ...c.photos, [slotId]: url } });
      }
      if (directError) console.warn("Direct upload fell back to the server route:", directError);
      flash("ok", kind === "video" ? "Video uploaded." : "Photo uploaded.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === "Signed out") return;
      if (/unauthori[sz]ed|401/i.test(msg)) { try { expired(); } catch { /* already handled */ } return; }
      flash("err", msg, 8000);
    } finally {
      setBusy("");
      setProgress(null);
    }
  }

  const clearPhoto = (slotId: string) => post({ action: "clearPhoto", slotId }, slotId);

  // ---- the panels, grouped like Apple's Settings sidebar -------------------
  const sections: Section[] = useMemo(() => {
    const photoPanels: Panel[] = groups.map((g) => ({
      id: `g-${g.key}`,
      label: g.title,
      sub: g.where,
      icon: GROUP_ICON[g.key] ?? "image",
      render: () => (
        <>
          <PanelHead title={g.title} sub={`The photos and videos on ${g.where}. Changes go live the moment you upload.`} live={liveFor(g.where)} />
          <div className="st-grid">
            {g.slots.map((s) => (
              <SlotCard
                key={s.id}
                slot={s}
                photo={content.photos[s.id]}
                video={content.videos[s.id]}
                busy={busy === s.id}
                progress={busy === s.id ? progress : null}
                onUpload={(f) => upload(s.id, f, s.kind === "video" ? "video" : "photo")}
                onClear={() => clearPhoto(s.id)}
                onVideo={(url) => post({ action: "setVideo", slotId: s.id, url }, s.id)}
              />
            ))}
          </div>
          <p className="st-footnote"><Icon name="info" /> <span>Where files are stored: {storage}</span></p>
        </>
      ),
    }));

    const stories: Panel = {
      id: "stories", label: "Client stories", icon: "quote", count: content.stories.length,
      render: () => (
        <>
          <PanelHead title="Client stories" live="/client-love" />
          <RowsEditor<Story>
            embedded
            id="stories"
            title="Client stories"
            hint="Real words only, and only with their blessing. The quote is what shows on the home page and Client Love; the before / the work / after rows build the full story on /stories. Tick “feature” for the three you want on the home page."
            rows={content.stories}
            photos={content.photos}
            photoPrefix="story"
            photoHint="Their photo — shown as a small circle beside their words."
            blank={() => ({ id: `s-${Date.now().toString(36)}`, name: "", quote: "", featured: false })}
            fields={[
              { key: "name", label: "Name" }, { key: "role", label: "Who they are (e.g. Actor · Mother)" }, { key: "program", label: "Program — their words then appear on that page too", type: "select", options: [["", "— none —"], ...PROGRAM_OPTIONS.map((n): [string, string] => [n, n])] },
              { key: "featured", label: "Feature on the home page", type: "checkbox" },
              { key: "quote", label: "Their words", type: "textarea", full: true },
              { key: "before", label: "Where they started", type: "textarea" }, { key: "during", label: "The work", type: "textarea" }, { key: "after", label: "Where they are now", type: "textarea" },
            ]}
            busy={busy === "stories"}
            onSave={(items) => post({ action: "setStories", items }, "stories")}
            onUpload={upload}
            onClear={clearPhoto}
          />
        </>
      ),
    };

    const becoming: Panel = {
      id: "becoming", label: "The Becoming · case studies", icon: "sparkle", count: content.becomingStories.length,
      render: () => (
        <>
          <PanelHead title="The Becoming · case studies" live="/programs/the-becoming" />
          <RowsEditor<CaseStudy>
            embedded
            id="becoming"
            title="The Becoming · case studies & testimonies"
            hint="Only on the Becoming page, separate from the client stories. Fill in “Where she started”, “The work” and “Where she is now” and it becomes a full case-study chapter with the photo, the headline and the quote. Leave those three empty and it joins the testimony wall underneath. Rows show in this order — put your strongest first. Paste a YouTube link and their video plays inside their chapter."
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
            onClear={clearPhoto}
          />
        </>
      ),
    };

    const liberatewords: Panel = {
      id: "liberatewords", label: "Liberate · testimonials", icon: "sun", count: content.liberateWords.length,
      render: () => (
        <>
          <PanelHead title="Liberate · testimonials" live="/liberate" />
          <RowsEditor<Story>
            embedded
            id="liberatewords"
            title="Liberate · testimonials"
            hint="Only on the Liberate page, from real Liberate students. The quote shows in the words section; the photo can be their portrait or a screenshot of their message. Whole-screen message screenshots go in the Liberate photo group (“Testimonial screenshots”)."
            rows={content.liberateWords}
            photos={content.photos}
            photoPrefix="libw"
            photoHint="Their portrait, or a screenshot of their message."
            blank={() => ({ id: `lw-${Date.now().toString(36)}`, name: "", quote: "" })}
            fields={[{ key: "name", label: "Name" }, { key: "role", label: "Who they are · which Liberate cohort" }, { key: "quote", label: "Their words", type: "textarea" }]}
            busy={busy === "liberatewords"}
            onSave={(items) => post({ action: "setLiberateWords", items }, "liberatewords")}
            onUpload={upload}
            onClear={clearPhoto}
          />
        </>
      ),
    };

    const speakwords: Panel = {
      id: "speakwords", label: "Organiser words", icon: "quote", count: content.speakingWords.length,
      render: () => (
        <>
          <PanelHead title="Words from organisers & audiences" live="/speaking" />
          <RowsEditor<Story>
            embedded
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
            onClear={clearPhoto}
          />
        </>
      ),
    };

    const talks: Panel = {
      id: "talks", label: "Events & stages", icon: "mic", count: content.talks.length,
      render: () => (
        <>
          <PanelHead title="Events, stages & gatherings" live="/speaking" />
          <RowsEditor<Talk>
            embedded
            id="talks"
            title="Events, stages & gatherings"
            hint="Every room you've held — keynotes, workshops, panels, summits, retreats, company days, founders' tables. Each one can carry what you covered and up to seven photos, and you choose which pages it appears on. Leave “Show on” empty and I'll place it sensibly from the type and organisation. Dates can be a year (2024), a month (2026-10), a day (2026-10-07) or a span (2021–2023); anything in the future shows under “Coming up”."
            rows={content.talks}
            photos={content.photos}
            photoPrefix="talk"
            photoHint="Cover photo — the one that shows in the list."
            extraPhotos={6}
            blank={() => ({ id: `t-${Date.now().toString(36)}`, title: "", org: "", kind: "keynote" })}
            fields={[
              { key: "title", label: "Talk title" }, { key: "org", label: "Event / organisation" },
              { key: "date", label: "Date (YYYY, YYYY-MM or YYYY-MM-DD)", placeholder: "2026-10-07" }, { key: "location", label: "City / venue" },
              { key: "kind", label: "Type", type: "select", options: [["keynote", "Keynote"], ["workshop", "Workshop"], ["panel", "Panel"], ["summit", "Summit"], ["retreat", "Retreat"], ["other", "Other"]] },
              { key: "url", label: "Link — YouTube, Spotify, TikTok and news links get a preview image automatically; Facebook/Instagram show a badge until you add a photo below", placeholder: "https://…" },
              { key: "blurb", label: "One line about it", full: true },
              { key: "details", label: "What you talked about / what happened in the room — shown when someone opens it", type: "textarea", full: true },
              { key: "showOn", label: "Show on", type: "multi", options: TALK_SURFACES as unknown as [string, string][], full: true },
            ]}
            busy={busy === "talks"}
            onSave={(items) => post({ action: "setTalks", items }, "talks")}
            onUpload={upload}
            onClear={clearPhoto}
          />
        </>
      ),
    };

    const pressCfg = [
      { id: "press", title: "Television & video features", live: "/speaking", kinds: ["tv", "video"] as PressItem["kind"][], icon: "tv" as IconName, hint: "TV segments and video features about you. Shown as cards on /speaking. Paste a YouTube link for an automatic preview; Facebook needs a photo below." },
      { id: "podcasts", title: "Podcast features", live: "/podcast", kinds: ["podcast"] as PressItem["kind"][], icon: "mic" as IconName, hint: "Other people’s podcasts you’ve been a guest on. Shown on /speaking and under “Libni as a guest” on /podcast. YouTube and Spotify links preview automatically." },
      { id: "writeups", title: "Write-ups & press", live: "/speaking", kinds: ["article"] as PressItem["kind"][], icon: "doc" as IconName, hint: "Articles and features in print and online. Shown on /speaking and the media kit. Most news links preview automatically." },
    ];
    const pressPanels: Panel[] = pressCfg.map((sec) => ({
      id: sec.id, label: sec.title, icon: sec.icon, count: content.press.filter((p) => sec.kinds.includes(p.kind)).length,
      render: () => (
        <>
          <PanelHead title={sec.title} live={sec.live} />
          <RowsEditor<PressItem>
            embedded
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
            onClear={clearPhoto}
          />
        </>
      ),
    }));

    const brands: Panel = {
      id: "brands", label: "Brands & logos", icon: "tag", count: content.brands.length,
      render: () => (
        <>
          <PanelHead title="Brands, organisations & outlets" live="/speaking" />
          <RowsEditor<Brand>
            embedded
            id="brands"
            title="Brands, organisations & outlets"
            hint="Everyone you’ve worked with or been featured by. Upload a logo (PNG with a transparent background is best) and it joins the scrolling row on /speaking; names without a logo appear as a line of text underneath."
            rows={content.brands}
            photos={content.photos}
            photoPrefix="brand"
            photoHint="Logo."
            blank={() => ({ id: `b-${Date.now().toString(36)}`, name: "" })}
            fields={[{ key: "name", label: "Name" }, { key: "url", label: "Website (optional)", placeholder: "https://…" }]}
            busy={busy === "brands"}
            onSave={(items) => post({ action: "setBrands", items }, "brands")}
            onUpload={upload}
            onClear={clearPhoto}
          />
        </>
      ),
    };

    const keynotes: Panel = {
      id: "keynotes", label: "Signature keynotes", icon: "star", count: content.keynotes.length,
      render: () => (
        <>
          <PanelHead title="Signature keynotes" live="/speaking" />
          <RowsEditor<Keynote>
            embedded
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
            onClear={clearPhoto}
          />
        </>
      ),
    };

    const mediakit: Panel = {
      id: "mediakit", label: "Media kit", icon: "kit",
      render: () => (
        <>
          <PanelHead title="Media kit" sub="What organisers and press copy from /media-kit. Headshots live in the photo sections." live="/media-kit" />
          <MediaKitEditor embedded initial={content.mediaKit} busy={busy === "mediakit"} onSave={(mediaKit) => post({ action: "setMediaKit", mediaKit }, "mediakit")} />
        </>
      ),
    };

    const biolinks: Panel = {
      id: "biolinks", label: "Link in bio", icon: "link", count: content.bioLinks.length,
      render: () => (
        <>
          <PanelHead title="Link in bio" live="/links" />
          <RowsEditor<BioLink>
            embedded
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
            onClear={clearPhoto}
          />
        </>
      ),
    };

    const links: Panel = {
      id: "links", label: "Links", icon: "link",
      render: () => (
        <>
          <PanelHead title="Your links" sub="Paste once and the right things appear across the site — your podcast player, booking link, Instagram feed and more." />
          <div className="st-grid">
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
        </>
      ),
    };

    const podcast: Panel = {
      id: "podcast", label: "Podcast episodes", icon: "headphones", count: content.podcast.length,
      render: () => (
        <>
          <PanelHead title="Podcast episodes" live="/podcast" />
          <ListEditor
            embedded
            title="Podcast episodes"
            hint="Optional. If you paste your Spotify show under Links, the player already lists your latest episodes — add rows here only to feature specific ones."
            items={content.podcast}
            busy={busy === "podcast"}
            onSave={(items) => post({ action: "setList", key: "podcast", items }, "podcast")}
          />
        </>
      ),
    };

    const events: Panel = {
      id: "events", label: "Upcoming events", icon: "calendar", count: content.events.length,
      render: () => (
        <>
          <PanelHead title="Upcoming events" live="/experiences" />
          <ListEditor
            embedded
            title="Upcoming events"
            hint="Workshops, circles and retreats with dates. Shown on Experiences and linked from the home page. Hidden until you add the first one."
            items={content.events}
            busy={busy === "events"}
            onSave={(items) => post({ action: "setList", key: "events", items }, "events")}
          />
        </>
      ),
    };

    const writings: Panel = {
      id: "writings", label: "Write-ups & letters", icon: "doc", count: content.writings.length,
      render: () => (
        <>
          <PanelHead title="Write-ups & letters" live="/writings" />
          <ListEditor
            embedded
            title="Write-ups & letters"
            hint="Your Substack posts and essays. The home-page section stays hidden until you add the first one."
            items={content.writings}
            busy={busy === "writings"}
            onSave={(items) => post({ action: "setList", key: "writings", items }, "writings")}
          />
        </>
      ),
    };

    return [
      { title: "Your pages", panels: photoPanels },
      { title: "Stories & words", panels: [stories, becoming, liberatewords, speakwords] },
      { title: "Stages & press", panels: [talks, ...pressPanels, brands, keynotes] },
      { title: "Your site", panels: [mediakit, biolinks, links, podcast, events, writings] },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, busy, progress, groups, storage, direct]);

  const allPanels = useMemo(() => sections.flatMap((s) => s.panels), [sections]);
  const current = allPanels.find((p) => p.id === active) ?? allPanels[0];

  const q = query.trim().toLowerCase();
  const filtered: Section[] = q
    ? [{ title: "Results", panels: allPanels.filter((p) => p.label.toLowerCase().includes(q) || (p.sub ?? "").toLowerCase().includes(q)) }]
    : sections;

  function openPanel(id: string) {
    setActive(id);
    setView("panel");
    setQuery("");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  return (
    <div className={`st v-${view}`}>
      <aside className="st-side">
        <div className="st-brand">
          <h1>Studio</h1>
          <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
        </div>
        <div className="st-search">
          <Icon name="search" />
          <input type="search" placeholder="Search settings" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {filtered.map((sec) => (
          sec.panels.length > 0 && (
            <nav key={sec.title} className="st-group">
              <p>{sec.title}</p>
              {sec.panels.map((p) => (
                <button key={p.id} type="button" className={`st-item${p.id === current.id && view === "panel" ? " on" : ""}`} onClick={() => openPanel(p.id)}>
                  <span className="st-tile"><Icon name={p.icon} /></span>
                  <span className="st-item-label">
                    <b>{p.label}</b>
                    {p.sub && <small>{p.sub}</small>}
                  </span>
                  {typeof p.count === "number" && <span className="st-count">{p.count}</span>}
                  <span className="st-chevron"><Icon name="chevron" /></span>
                </button>
              ))}
            </nav>
          )
        ))}
        {q && filtered[0].panels.length === 0 && <p className="st-empty" style={{ padding: "0 12px" }}>Nothing matches “{query}”.</p>}
      </aside>

      <main className="st-main">
        <button type="button" className="st-back" onClick={() => setView("menu")}><Icon name="back" /> All settings</button>
        {current.render()}
      </main>

      {note && <div className={`st-toast ${note.kind}`}>{note.text}</div>}
    </div>
  );
}

function PanelHead({ title, sub, live }: { title: string; sub?: string; live?: string }) {
  return (
    <div className="st-head">
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
      {live && <a className="st-head-live" href={live} target="_blank" rel="noreferrer">View live page <Icon name="ext" /></a>}
    </div>
  );
}

type Field<T> = { key: keyof T & string; label: string; type?: "text" | "textarea" | "select" | "checkbox" | "multi"; options?: [string, string][]; placeholder?: string; full?: boolean };

/** One editor for any list of structured rows (stories, talks, press), each row with an optional photo. */
function RowsEditor<T extends { id: string }>({ id, title, hint, rows: initial, fields, photos, photoPrefix, photoHint = "", extraPhotos = 0, embedded = false, blank, busy, onSave, onUpload, onClear }: {
  id: string; title: string; hint: string; rows: T[]; fields: Field<T>[]; photos: Record<string, string>; photoPrefix?: string; photoHint?: string;
  /** Numbered photos after the cover (`<prefix>_<id>_1` …). */
  extraPhotos?: number;
  embedded?: boolean;
  blank: () => T; busy: boolean; onSave: (rows: T[]) => void; onUpload: (slotId: string, f: File) => void; onClear: (slotId: string) => void;
}) {
  const [rows, setRows] = useState<T[]>(initial);
  const [open, setOpen] = useState<string | null>(null);
  function set(i: number, key: keyof T, value: unknown) { setRows((r) => r.map((row, n) => (n === i ? { ...row, [key]: value } : row))); }
  const label = (row: T) => String((row as Record<string, unknown>).name ?? (row as Record<string, unknown>).title ?? "") || "Untitled";

  const sectionStyle = embedded ? undefined : { marginBottom: 56, paddingTop: 40, borderTop: "1px solid var(--line)" };

  return (
    <section id={id} style={sectionStyle}>
      {embedded ? (
        <div className="st-toolbar">
          <p className="muted" style={{ maxWidth: "66ch", fontSize: 14.5 }}>{hint}</p>
          <button className="btn small" disabled={busy} onClick={() => onSave(rows)}>{busy ? "Saving…" : "Save"}</button>
        </div>
      ) : (
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div><h2 style={{ fontSize: 26, marginBottom: 6 }}>{title} <span className="muted" style={{ fontSize: 15 }}>· {rows.length}</span></h2><p className="muted" style={{ marginBottom: 20, maxWidth: "70ch" }}>{hint}</p></div>
          <button className="btn small" disabled={busy} onClick={() => onSave(rows)}>{busy ? "Saving…" : "Save"}</button>
        </div>
      )}

      {rows.length === 0 && <p className="st-empty">Nothing here yet. Press “Add another” to create the first one.</p>}

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
                        <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 26, textTransform: "none", letterSpacing: 0 }}>
                          <input type="checkbox" checked={Boolean(row[f.key])} onChange={(e) => set(i, f.key, e.target.checked)} style={{ width: "auto", accentColor: "var(--plum)" }} /> {f.label}
                        </label>
                      ) : f.type === "multi" ? (
                        <><label>{f.label}</label>
                          <div className="row" style={{ gap: 8 }}>
                            {f.options?.map(([v, l]) => {
                              const cur = (row[f.key] as unknown as string[] | undefined) ?? [];
                              const on = cur.includes(v);
                              return <button type="button" key={v} className={`chip${on ? " on" : ""}`} onClick={() => set(i, f.key, on ? cur.filter((x) => x !== v) : [...cur, v])}>{l}</button>;
                            })}
                          </div></>
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
                {photoPrefix && extraPhotos > 0 && (
                  <div style={{ marginTop: 6 }}>
                    {Array.from({ length: extraPhotos }, (_, n) => `${slotId}_${n + 1}`).map((sid, n) => (
                      <RowPhoto key={sid} slotId={sid} photo={photos[sid]} hint={`More photos · ${n + 1}`} onUpload={(f) => onUpload(sid, f)} onClear={() => onClear(sid)} />
                    ))}
                  </div>
                )}
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
      <input ref={ref} type="file" accept={IMAGE_ACCEPT} style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }} />
      <button type="button" className="btn small ghost" onClick={() => ref.current?.click()}>{photo ? "Replace photo" : "Add photo"}</button>
      {photo && <button type="button" className="btn small ghost" onClick={onClear}>Remove photo</button>}
      <span className="muted" style={{ fontSize: 12 }}>{hint} <code style={{ fontSize: 10 }}>{slotId}</code></span>
    </div>
  );
}

function MediaKitEditor({ initial, busy, embedded = false, onSave }: { initial: MediaKit; busy: boolean; embedded?: boolean; onSave: (m: MediaKit) => void }) {
  const [m, setM] = useState<MediaKit>(initial);
  return (
    <section id="mediakit" style={embedded ? undefined : { marginBottom: 56, paddingTop: 40, borderTop: "1px solid var(--line)" }}>
      {!embedded && (
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div><h2 style={{ fontSize: 26, marginBottom: 6 }}>Media kit</h2><p className="muted" style={{ marginBottom: 20, maxWidth: "70ch" }}>What organisers and press copy from /media-kit. Headshots are in the photo section above.</p></div>
          <button className="btn small" disabled={busy} onClick={() => onSave(m)}>{busy ? "Saving…" : "Save"}</button>
        </div>
      )}
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

function SlotCard({ slot, photo, video, busy, progress, onUpload, onClear, onVideo }: {
  slot: Slot; photo?: string; video?: string; busy: boolean; progress: number | null;
  onUpload: (f: File) => void; onClear: () => void; onVideo: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(video ?? "");
  const isVideo = slot.kind === "video";
  const shown = photo || slot.fallback;
  const videoFile = video && /\.(mp4|webm|mov|m4v)(\?|$)|blob\.vercel-storage\.com/i.test(video) ? video : "";
  const busyLabel = progress != null && progress < 100 ? `Uploading… ${progress}%` : progress === 100 ? "Saving…" : "Uploading…";

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ aspectRatio: slot.aspect, background: "var(--linen)", borderRadius: "var(--r-sm)", marginBottom: 12, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isVideo ? (
          videoFile ? (
            <video src={videoFile} controls playsInline preload="metadata" style={{ width: "100%", height: "100%", background: "#000" }} />
          ) : (
            <span className="muted" style={{ fontSize: 12, textAlign: "center", padding: 10 }}>{video ? "Video link set" : "No video yet"}</span>
          )
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
          <input
            ref={fileRef}
            type="file"
            accept={VIDEO_ACCEPT}
            style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }}
          />
          <div className="row" style={{ marginBottom: 10 }}>
            <button className="btn small" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? busyLabel : videoFile ? "Replace video file" : "Upload a video file"}
            </button>
            {video && <button className="btn small ghost" disabled={busy} onClick={() => { setUrl(""); onVideo(""); }}>Remove</button>}
          </div>
          <p className="muted" style={{ fontSize: 12, margin: "0 0 6px" }}>MP4 or MOV, up to 500MB — or paste a YouTube / Vimeo link:</p>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=…" style={{ fontSize: 13 }} />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn small ghost" disabled={busy || !url.trim()} onClick={() => onVideo(url)}>{busy ? "Saving…" : "Save link"}</button>
          </div>
        </>
      ) : (
        <>
          <input
            ref={fileRef}
            type="file"
            accept={IMAGE_ACCEPT}
            style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }}
          />
          <div className="row">
            <button className="btn small" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? busyLabel : photo ? "Replace photo" : "Upload photo"}
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

function ListEditor({ title, hint, items, busy, embedded = false, onSave }: {
  title: string; hint: string; items: MediaLink[]; busy: boolean; embedded?: boolean; onSave: (items: MediaLink[]) => void;
}) {
  const [rows, setRows] = useState<MediaLink[]>(items.length ? items : []);

  function set(i: number, patch: Partial<MediaLink>) {
    setRows((r) => r.map((row, n) => (n === i ? { ...row, ...patch } : row)));
  }

  return (
    <section style={embedded ? undefined : { marginBottom: 56, paddingTop: 40, borderTop: "1px solid var(--line)" }}>
      {embedded ? (
        <div className="st-toolbar">
          <p className="muted" style={{ maxWidth: "66ch", fontSize: 14.5 }}>{hint}</p>
          <button className="btn small" disabled={busy} onClick={() => onSave(rows)}>{busy ? "Saving…" : "Save"}</button>
        </div>
      ) : (
        <>
          <h2 style={{ fontSize: 26, marginBottom: 6 }}>{title}</h2>
          <p className="muted" style={{ marginBottom: 20 }}>{hint}</p>
        </>
      )}

      {rows.length === 0 && <p className="st-empty">Nothing here yet. Press “Add another” to create the first one.</p>}

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

// ---- icons: small stroke glyphs in the sidebar tiles -----------------------
type IconName = "home" | "video" | "chat" | "heart" | "person" | "sparkle" | "sun" | "image" | "quote" | "mic" | "tv" | "doc" | "tag" | "star" | "kit" | "link" | "headphones" | "calendar" | "search" | "chevron" | "ext" | "info" | "back";

function Icon({ name }: { name: IconName }) {
  const p: Record<IconName, ReactNode> = {
    home: <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />,
    video: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m10 9 5 3-5 3V9Z" /></>,
    chat: <path d="M4 5h16v11H9l-4 3v-3H4V5Z" />,
    heart: <path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.5 12 20 12 20Z" />,
    person: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></>,
    sparkle: <path d="M12 3c.6 4 2 5.4 6 6-4 .6-5.4 2-6 6-.6-4-2-5.4-6-6 4-.6 5.4-2 6-6Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="m4 18 5-5 4 3 3-2 4 4" /></>,
    quote: <path d="M9 7H5v5h4l-1 5M19 7h-4v5h4l-1 5" />,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
    tv: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="m8 3 4 3 4-3" /></>,
    doc: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>,
    tag: <><path d="M4 4h7l9 9-7 7-9-9V4Z" /><circle cx="8" cy="8" r="1.3" /></>,
    star: <path d="m12 3 2.6 5.6 6.1.7-4.5 4.1 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7L12 3Z" />,
    kit: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5h6v2" /></>,
    link: <path d="M10 14a4 4 0 0 0 6 .5l2-2a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6-.5l-2 2a4 4 0 0 0 6 6l1-1" />,
    headphones: <path d="M4 13v4a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 0V12a8 8 0 0 1 16 0v1a2 2 0 0 0-2 0h-1v6h1a2 2 0 0 0 2-2v-4" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
    ext: <><path d="M14 4h6v6M20 4l-8 8" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    back: <path d="m14 6-6 6 6 6" />,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {p[name]}
    </svg>
  );
}
