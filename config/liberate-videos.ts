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
}

export const DEFAULT_LIBERATE_VIDEOS: LiberateVideo[] = [
  { url: "https://vimeo.com/1232676253", name: "Joyce", role: "Liberate 4", w: 16, h: 9, dur: 173, poster: "/photos/liberate/vid-1232676253.jpg" },
  { url: "https://vimeo.com/1232676156", name: "Danessa", role: "Liberate 2", w: 9, h: 16, dur: 64, poster: "/photos/liberate/vid-1232676156.jpg" },
  { url: "https://vimeo.com/1232675412", name: "Precious", role: "Liberate 4", w: 16, h: 9, dur: 149, poster: "/photos/liberate/vid-1232675412.jpg" },
  { url: "https://vimeo.com/1232676628", name: "Victoria", role: "Liberate 3", w: 9, h: 16, dur: 185, poster: "/photos/liberate/vid-1232676628.jpg" },
  { url: "https://vimeo.com/1232675915", name: "Kimi", role: "Liberate 4", w: 16, h: 9, dur: 220, poster: "/photos/liberate/vid-1232675915.jpg" },
  { url: "https://vimeo.com/1232675738", name: "Bam", role: "Liberate 3", w: 9, h: 16, dur: 163, poster: "/photos/liberate/vid-1232675738.jpg" },
  { url: "https://vimeo.com/1232675467", name: "Mitch", role: "Liberate 4", w: 16, h: 9, dur: 97, poster: "/photos/liberate/vid-1232675467.jpg" },
  { url: "https://vimeo.com/1232676439", name: "Tonet", role: "Liberate 3", w: 9, h: 16, dur: 277, poster: "/photos/liberate/vid-1232676439.jpg" },
  { url: "https://vimeo.com/1232675411", name: "Ikay", role: "Liberate", w: 16, h: 9, dur: 169, poster: "/photos/liberate/vid-1232675411.jpg" },
  { url: "https://vimeo.com/1232675409", name: "Pawla", role: "Liberate 1", w: 9, h: 16, dur: 70, poster: "/photos/liberate/vid-1232675409.jpg" },
];

/** The numeric id in any vimeo.com / player.vimeo.com link, or null. */
export function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d{6,})/);
  return m ? m[1] : null;
}
