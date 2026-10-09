// ============================================================================
// Real words from Libni's 1:1 clients — the proof sections on the Power Hour
// and The Becoming pages, built the way the Liberate page works (spotlight →
// quote wall → "as they wrote it" screenshots).
//
// Sources (all hers, 2026-10-09): Drive › 1:1 Mentorship › "Mentorship
// Testimonial Transcripts" + "Interview Highlights" (quotes are verbatim
// from the highlights doc), the designed posters in "Thumbnails", and the DM
// screenshots in "1:1 work with me". Nothing here is invented. Videos live in
// her Drive (Landscape/Portrait); `vimeo` is filled in once she uploads them.
// ============================================================================

export interface ProofStory {
  id: string;
  name: string;
  role?: string;
  /** Verbatim short quote (Interview Highlights doc). */
  quote: string;
  /** Designed poster from her Drive (public/photos/one-on-one/posters). */
  poster?: string;
  /** Vimeo id once the testimony video is uploaded. Drive file name noted for her. */
  vimeo?: string;
  driveFile?: string;
}

export const ONE_ON_ONE_STORIES: ProofStory[] = [
  {
    id: "jana", name: "Jana", role: "Head of Operations · 1:1 mentorship",
    quote: "I love working with Lib. She gave me space to think about what I really want. If all-in ka, all-in din siya. Libni became a door for me to see. To be clear. If you're a person who's tired of carrying things on your own, Lib can hold you until ma-feel mo na you can do it na ulit.",
    poster: "/photos/one-on-one/posters/jana.jpg", vimeo: "1234287461", driveFile: "Jana Testimonial Interview Landscape.mp4",
  },
  {
    id: "hannah", name: "Hannah", role: "Chef, Sydney · 1:1 mentorship",
    quote: "I'm tired of the cycle. Working with her changed my mindset. It changed my view and how I deal with things. Indeed, I can say that working with her is a safe space. After working with coach, challenges, problems, situations are much more structured in the way I know I can get through it. It's life changing.",
    poster: "/photos/one-on-one/posters/hannah.jpg", vimeo: "1234287460", driveFile: "Hannah with subtitle.mp4",
  },
  {
    id: "zyra", name: "Zyra", role: "Mom · wife · 1:1 mentorship",
    quote: "Working with Lib is like dying a hundred times in a safe way. She was like this light at the end of the tunnel that's just there. During our one-on-ones, I could really be who I am. I got this power now that I can handle situations better. I love my life every day, even if it doesn't turn out the way that I want it to be.",
    poster: "/photos/one-on-one/posters/zyra.jpg", vimeo: "1234287585", driveFile: "Zyra Testimonial Landscape.mp4",
  },
  {
    id: "yokie", name: "Yokie", role: "Mom · 1:1 mentorship",
    quote: "I hit a point where I felt completely stuck. No matter what I tried, I couldn't seem to break through. Every session was intentional and purposeful. Through her guidance, I learned that no matter what obstacle shows up, the tools to overcome it already exist within me. No more saying I don't know what to do.",
    poster: "/photos/one-on-one/posters/yokie.jpg", driveFile: "yokieeen_dooweet (reel).mp4",
  },
  {
    id: "kay", name: "Kay", role: "Chef, Brisbane · 1:1 mentorship",
    quote: "She's so gentle and safe mag-handle ng spaces. Being in the session is not fixing. Being in the session is understanding yourself. If you're serious about your personal growth, a deep understanding about yourself, inner work — then doing it with Libni is gonna be worth it.",
    vimeo: "1234287459", driveFile: "Kay Testimonial Landscape.mp4",
  },
  // From her Instagram "1:1 Mentorship" highlight (2026-10-09) — the clients' own public posts, word for word.
  {
    id: "mika", name: "Mika", role: "1:1 mentorship",
    quote: "My life coach has been a big part of this shift. She's been walking with me through my healing journey — not to fix me, but to help me remember who I really am. Through our sessions I've learned to hold space for my emotions, choose softness over self-judgment, celebrate myself, respond — not react — and listen to my body before my inner critic. So yes, the glow is real. But the growth behind it? That's the real magic.",
    poster: "/photos/one-on-one/posters/mika.jpg",
  },
  {
    id: "nadia", name: "Nadia", role: "1:1 mentorship",
    quote: "God gave me you coz He knew I needed and deserved the best support from an angel like you! Thank you Lib! It's all worth it. Finding light in the dark is a gift. I'm at peace with my new found freedom! What would I have done without? You're a blessing!",
    poster: "/photos/one-on-one/posters/nadia.jpg",
  },
  // Transcribed from her video (Downloads › "Dane Mentorship Landscape.mp4", 2026-10-09); `vimeo` once uploaded.
  {
    id: "dane", name: "Dane", role: "1:1 mentorship",
    quote: "Before I met her, I was in this state where I really didn't know what to do. I was at a point where I didn't have any hope. And then I met her — her energy, how she talks to me as if she knew me already. Our first conversation together, it was like she knew me already. Really, just thank you. Thank you for changing lives. Just continue to do the work, continue the mission — because a lot of people need it.",
    poster: "/photos/one-on-one/posters/dane.jpg", driveFile: "Dane Mentorship Landscape.mp4",
  },
];

/** DM screenshots — “as they wrote it”. Paths under public/photos/one-on-one/dms. */
export interface ProofShot { src: string; alt: string; /** who it suits */ for: ("power-hour" | "becoming")[] }

export const ONE_ON_ONE_SHOTS: ProofShot[] = [
  { src: "/photos/one-on-one/dms/one-call.jpg", alt: "How much better I feel already after that one call", for: ["power-hour", "becoming"] },
  { src: "/photos/one-on-one/dms/session-today.jpg", alt: "I really appreciate our session today — the clarity you always bring", for: ["power-hour"] },
  { src: "/photos/one-on-one/dms/back-pain.jpg", alt: "Thank you for last night — ang gaan ng pakiramdam ko", for: ["power-hour"] },
  { src: "/photos/one-on-one/dms/plot-twist.jpg", alt: "Trusting you was one of the best decisions I've ever made", for: ["power-hour", "becoming"] },
  { src: "/photos/one-on-one/dms/seeing-me.jpg", alt: "Thank you for seeing me. For leading me back home.", for: ["power-hour", "becoming"] },
  { src: "/photos/one-on-one/dms/hypnosis.jpg", alt: "Your hypnosis — nakatulog daw siya", for: ["power-hour"] },
  { src: "/photos/one-on-one/dms/liberating.jpg", alt: "It was liberating. I feel happy right now.", for: ["power-hour"] },
  { src: "/photos/one-on-one/dms/freedom.jpg", alt: "I'm at peace with my new found freedom", for: ["becoming"] },
  { src: "/photos/one-on-one/dms/changed-life.jpg", alt: "You changed my life, Lib", for: ["becoming"] },
  { src: "/photos/one-on-one/dms/first-person.jpg", alt: "You were the first person who opened my eyes to all possibilities", for: ["becoming"] },
  { src: "/photos/one-on-one/dms/boundaries.jpg", alt: "Reclaiming my voice is not being selfish, it's protecting my peace", for: ["becoming"] },
  { src: "/photos/one-on-one/dms/peace.jpg", alt: "Naembody ko na talaga ang peace, Lib", for: ["becoming", "power-hour"] },
  { src: "/photos/one-on-one/dms/kaye-chia.jpg", alt: "Thank you for seeing me, and reminding us of who we really are", for: ["becoming"] },
  { src: "/photos/one-on-one/dms/8527.jpg", alt: "From the mindset, character dev, to showing up online — I learned it from you", for: ["becoming"] },
  { src: "/photos/one-on-one/dms/college.jpg", alt: "Here I am nearly reaching the finish line, because someone held space for me", for: ["becoming"] },
  { src: "/photos/one-on-one/dms/danessa.jpg", alt: "Generational trauma ends with me", for: ["becoming"] },
  { src: "/photos/one-on-one/dms/mika-learned.jpg", alt: "Through our sessions I've learned to hold space for my emotions, respond not react, and listen to my body before my inner critic", for: ["becoming"] },
  // Messages from her "1:1 work with me" folder and the Instagram highlight — cropped to the words only, no names or places.
  { src: "/photos/one-on-one/dms/see-the-light.jpg", alt: "Thank you for changing my life. Thank you for helping me see the light.", for: ["becoming", "power-hour"] },
  { src: "/photos/one-on-one/dms/dream-life.jpg", alt: "You inspired me and helped me. I'm creating the life of my dream now.", for: ["becoming"] },
  { src: "/photos/one-on-one/dms/gift.jpg", alt: "You alone is such a gift! I am so glad I found you.", for: ["becoming", "power-hour"] },
  { src: "/photos/one-on-one/dms/sister.jpg", alt: "I believe in your work and I know I trusted the right person to guide her", for: ["becoming"] },
  { src: "/photos/one-on-one/dms/possibilities.jpg", alt: "I never really thought about those possibilities we discussed", for: ["power-hour", "becoming"] },
  { src: "/photos/one-on-one/dms/ten-pounds.jpg", alt: "Laki ng nagawa mo for me — feeling ko I lost 10 lbs or more", for: ["becoming"] },
];

export function shotsFor(page: "power-hour" | "becoming"): ProofShot[] {
  return ONE_ON_ONE_SHOTS.filter((s) => s.for.includes(page));
}
