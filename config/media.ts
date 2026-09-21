// Photography. Libni's real photos live in /public/photos (cropped from her
// speaking portfolio). Mood images are Unsplash and can be swapped anytime.
const base = "https://images.unsplash.com/photo-";

export function img(url: string, w = 1200): string {
  // local files (in /public) are served as-is; Unsplash gets sizing params.
  if (url.startsWith("/")) return url;
  return `${url}?auto=format&fit=crop&w=${w}&q=80`;
}

export const PHOTOS = {
  hero: "/photos/libni-hero.jpg", // Libni — real portrait (smiling)
  story: "/photos/libni-portrait.jpg", // Libni — real seated portrait
  stage: "/photos/libni-stage.jpg", // Libni — real keynote / TEDx stage
  // mood imagery (Unsplash — swap freely)
  ambient: base + "1518708909080-704599b19972",
  ignite: base + "1559595500-e15296bdbb48",
  becoming: base + "1600618528240-fb9fc964b853",
  essence: base + "1518837695005-2083093ee35b",
  studio: base + "1547083723-7c73eaf54cc6",
};
