import { SitePage } from "@/app/components/Chrome";
import LiberateClient from "./LiberateClient";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function LiberatePage() {
  const { photos } = await getContent();
  return (
    <SitePage navOverlay>
      <LiberateClient photos={photos} />
    </SitePage>
  );
}
