import { SLOT_GROUPS } from "@/config/site-slots";
import { getContent } from "@/lib/content";
import { isLoggedIn } from "@/lib/auth";
import { usingBlob } from "@/lib/uploads";
import DeskLogin from "@/app/desk/DeskLogin";
import StudioClient from "./StudioClient";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  if (!(await isLoggedIn())) return <DeskLogin />;
  const content = await getContent();
  const direct = usingBlob();
  const storage = direct
    ? "Vercel Blob — uploads survive every deploy. Photos up to 25MB, videos up to 500MB."
    : "This computer (public/uploads) — fine for trying it out. Add BLOB_READ_WRITE_TOKEN before go-live so photos survive deploys.";

  return <StudioClient groups={SLOT_GROUPS} initial={content} storage={storage} direct={direct} />;
}
