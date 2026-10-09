// The Becoming lives at the cleaner URL /the-mentorship (Libni's call, 2026-10-09).
// The page content is the shared The Becoming component; the old /programs/the-becoming
// URL redirects here (see next.config.mjs).
import TheBecoming from "@/app/programs/the-becoming/page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Mentorship — 12-week 1:1 mentorship with Libni Fortuna",
  description:
    "My deepest private container. Twelve weeks of sustained 1:1 work with the mind, body, soul and emotions — weekly sessions, your own meditation portal, real-time support between sessions.",
};

export default function TheMentorshipPage() {
  return <TheBecoming />;
}
