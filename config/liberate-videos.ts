// Libni's Vimeo uploads of students on camera — the built-in "Hear it from them" set.
// Studio slots lib_video_1..10 replace this list; known ids keep their name/poster.
export interface LiberateVideo {
  url: string;
  poster?: string;
  name?: string;
  role?: string;
  w?: number;
  h?: number;
  dur?: number;
  /** One line they actually say on camera (from Libni's transcripts). */
  quote?: string;
}

export const DEFAULT_LIBERATE_VIDEOS: LiberateVideo[] = [
  { url: "https://vimeo.com/1232675409", name: "Pawla", role: "Liberate 1", w: 9, h: 16, dur: 70, poster: "/photos/liberate/vid-1232675409.jpg" },
  { url: "https://vimeo.com/1232676253", name: "Joyce", role: "Liberate 4 · business owner", w: 16, h: 9, dur: 173, poster: "/photos/liberate/poster-joyce.jpg", quote: "It’s more of a space that you can really be you. You can be all out." },
  { url: "https://vimeo.com/1232676156", name: "Danessa", role: "Liberate 2", w: 9, h: 16, dur: 64, poster: "/photos/liberate/vid-1232676156.jpg" },
  { url: "https://vimeo.com/1232675412", name: "Precious", role: "Liberate 4 · nurse, public servant", w: 16, h: 9, dur: 149, poster: "/photos/liberate/poster-precious.jpg", quote: "It brought me to my life again." },
  { url: "https://vimeo.com/1232676628", name: "Victoria", role: "Liberate 3", w: 9, h: 16, dur: 185, poster: "/photos/liberate/vid-1232676628.jpg" },
  { url: "https://vimeo.com/1232675915", name: "Kimi", role: "Liberate 4 · image consultant", w: 16, h: 9, dur: 220, poster: "/photos/liberate/poster-kimi.jpg", quote: "It’s not just your ordinary therapy — it’s a practice." },
  { url: "https://vimeo.com/1232675738", name: "Bam", role: "Liberate 3", w: 9, h: 16, dur: 163, poster: "/photos/liberate/vid-1232675738.jpg", quote: "I know who I am, I know what I can do. Never hold yourself back from investing in yourself." },
  { url: "https://vimeo.com/1232675467", name: "Mitch", role: "Liberate 4 · IT consultant", w: 16, h: 9, dur: 97, poster: "/photos/liberate/poster-mitch.jpg", quote: "It taught me to be more authentic and more accepting of who I am." },
  { url: "https://vimeo.com/1232676439", name: "Tonet", role: "Liberate 3", w: 9, h: 16, dur: 277, poster: "/photos/liberate/vid-1232676439.jpg", quote: "I just became so confident in myself that I trust myself, and I know I can do anything." },
  { url: "https://vimeo.com/1232675411", name: "Ikay", role: "Liberate 4 · digital marketer", w: 16, h: 9, dur: 169, poster: "/photos/liberate/poster-ikay.jpg", quote: "Liberate made it very easy for me to understand myself — and just really let go." },
];

/** The numeric id in any vimeo.com / player.vimeo.com link, or null. */
export function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d{6,})/);
  return m ? m[1] : null;
}
