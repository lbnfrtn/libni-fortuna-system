import { SLOT_GROUPS } from "@/config/site-slots";
import { getContent } from "@/lib/content";
import { isLoggedIn } from "@/lib/auth";
import DeskLogin from "@/app/desk/DeskLogin";
import StudioClient from "./StudioClient";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  if (!(await isLoggedIn())) return <DeskLogin />;
  const content = await getContent();
  const storage = process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID
    ? "Vercel Blob — uploads survive every deploy."
    : "This computer (public/uploads) — fine for trying it out. Add BLOB_READ_WRITE_TOKEN before go-live so photos survive deploys.";

  return (
    <div className="wrap" style={{ maxWidth: 1100 }}>
      <h1>Studio</h1>
      <p className="muted" style={{ marginBottom: 40 }}>
        Every photo, video and link on the public site. Changes go live the moment you save — no deploy needed.
      </p>
      <StudioClient groups={SLOT_GROUPS} initial={content} storage={storage} />
    </div>
  );
}
