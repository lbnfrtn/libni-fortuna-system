import { describe, it, expect } from "vitest";
import { safeHtml } from "../lib/safe-html";

describe("safeHtml (Substack → app reader)", () => {
  it("keeps paragraphs, emphasis, headings and https links", () => {
    const out = safeHtml('<h2>Hi</h2><p class="x" style="color:red">I <em>am</em> <a href="https://a.com/x?a=1&amp;b=2" onclick="evil()">here</a></p>');
    expect(out).toBe('<h2>Hi</h2><p>I <em>am</em> <a href="https://a.com/x?a=1&amp;b=2" target="_blank" rel="noopener noreferrer">here</a></p>');
  });
  it("drops scripts, iframes, buttons and Substack widgets with their contents", () => {
    const out = safeHtml('<p>a</p><script>alert(1)</script><iframe src="https://x"></iframe><div class="subscription-widget-wrap"><div class="subscription-widget"><p>Subscribe now</p><button>Go</button></div></div><p>b</p>');
    expect(out).toBe("<p>a</p><p>b</p>");
  });
  it("refuses javascript: and http: urls, keeps https images", () => {
    const out = safeHtml('<a href="javascript:alert(1)">x</a><img src="http://x/a.png"><img src="https://x/b.png" alt="b" onerror="e()">');
    expect(out).toBe('<a>x</a><img src="https://x/b.png" alt="b" loading="lazy">');
  });
  it("closes tags left open and ignores stray closers", () => {
    expect(safeHtml("<p><strong>bold</p></em>")).toBe("<p><strong>bold</strong></p>");
  });
  it("keeps Substack images inside <picture>, never swallows the post after a <source>", () => {
    const out = safeHtml('<figure><a href="https://x/big.png"><picture><source type="image/webp" srcset="https://x/a.webp"><img src="https://x/a.png" alt=""></picture></a></figure><p>after</p>');
    expect(out).toBe('<figure><a href="https://x/big.png" target="_blank" rel="noopener noreferrer"><img src="https://x/a.png" alt="" loading="lazy"></a></figure><p>after</p>');
  });
  it("escapes stray angle brackets in text", () => {
    expect(safeHtml("<p>1 &lt; 2 and 3 > 2</p>")).toBe("<p>1 &lt; 2 and 3 &gt; 2</p>");
  });
});
