// Turn a Substack post's HTML into a small, safe subset for the Project Me app's reader.
// Allow-list only: anything not listed is dropped (its text kept), and script-like
// blocks are dropped with everything inside them. Attributes are rebuilt, never copied.

const KEEP = new Set(["p", "h1", "h2", "h3", "h4", "blockquote", "em", "strong", "b", "i", "u", "ul", "ol", "li", "a", "img", "figure", "figcaption", "br", "hr"]);
const VOID = new Set(["img", "br", "hr"]);
// Removed together with their contents (Substack widgets, buttons, media embeds, forms, code).
const DROP = new Set(["script", "style", "iframe", "svg", "button", "form", "input", "textarea", "select", "noscript", "template", "object", "video", "audio", "head", "title", "math"]);
// Void tags never get a closer — drop them on their own (never wait for a closing tag).
const DROP_VOID = new Set(["input", "source", "embed", "link", "meta", "track", "wbr", "col", "area", "base", "param"]);
const DROP_CLASS = /\b(subscription-widget|subscribe-widget|button-wrapper|share-dialog|footnote-anchor|image-link-expand|captioned-button)\b/;

function attr(raw: string, name: string): string | undefined {
  const m = new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i").exec(raw);
  return m ? (m[2] ?? m[3]) : undefined;
}
function safeUrl(u: string | undefined): string | undefined {
  if (!u) return undefined;
  const v = u.replace(/&amp;/g, "&").trim();
  return /^https:\/\/[^\s"'<>]+$/i.test(v) ? v.replace(/&/g, "&amp;").replace(/"/g, "&quot;") : undefined;
}

export function safeHtml(html: string): string {
  const out: string[] = [];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g;
  let last = 0, skip = 0, skipTag = "", depth = 0;
  let m: RegExpExecArray | null;
  const open: string[] = [];
  while ((m = re.exec(html))) {
    const text = html.slice(last, m.index);
    last = re.lastIndex;
    if (!skip) out.push(text.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    if (!m[2]) continue; // comment
    const close = m[1] === "/", tag = m[2].toLowerCase(), rest = m[3] || "";
    if (skip) {
      if (tag === skipTag) { if (close) { depth--; if (!depth) skip = 0; } else if (!/\/\s*$/.test(rest)) depth++; }
      continue;
    }
    if (DROP_VOID.has(tag)) continue;
    if (!close && (DROP.has(tag) || DROP_CLASS.test(attr(rest, "class") || ""))) {
      if (VOID.has(tag) || /\/\s*$/.test(rest)) continue;
      skip = 1; skipTag = tag; depth = 1; continue;
    }
    if (!KEEP.has(tag)) continue;
    if (close) {
      if (VOID.has(tag)) continue;
      const i = open.lastIndexOf(tag);
      if (i < 0) continue;
      while (open.length > i) out.push(`</${open.pop()}>`);
      continue;
    }
    if (tag === "a") {
      const href = safeUrl(attr(rest, "href"));
      out.push(href ? `<a href="${href}" target="_blank" rel="noopener noreferrer">` : "<a>");
      open.push("a");
    } else if (tag === "img") {
      const src = safeUrl(attr(rest, "src"));
      if (src) out.push(`<img src="${src}" alt="${(attr(rest, "alt") || "").replace(/"/g, "&quot;")}" loading="lazy">`);
    } else if (VOID.has(tag)) {
      out.push(`<${tag}>`);
    } else {
      out.push(`<${tag}>`);
      open.push(tag);
    }
  }
  if (!skip) out.push(html.slice(last).replace(/</g, "&lt;").replace(/>/g, "&gt;"));
  while (open.length) out.push(`</${open.pop()}>`);
  return out.join("").replace(/<p>\s*<\/p>/g, "").trim();
}
