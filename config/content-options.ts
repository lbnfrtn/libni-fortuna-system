// Option lists shared by the Studio (browser) and the content model (server).
// Kept free of Node imports so client components can use them.

/** Which public pages an engagement appears on. */
export type TalkSurface = "speaking" | "organizations" | "workshops" | "founders-circle";
export const TALK_SURFACES: [TalkSurface, string][] = [
  ["speaking", "Speaking (the archive)"],
  ["organizations", "For Organisations"],
  ["workshops", "Workshops & Trainings"],
  ["founders-circle", "Founders Circle"],
];

/** Programs a client story can belong to — offered as a list so pages can match reliably. */
export const PROGRAM_OPTIONS: string[] = [
  "The Becoming", "Power Hour", "Liberate", "Essence Retreat", "Founders Circle", "Workshops & Trainings",
  "Private Studio Sessions", "Private Experiences & Retreats", "For Organizations", "Speaking", "For Brands", "Project Me", "1:1",
];
