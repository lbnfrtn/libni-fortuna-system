import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isLoggedIn } from "@/lib/auth";
import { isValidSlot } from "@/config/site-slots";
import { IMAGE_TYPES, VIDEO_TYPES, MAX_VIDEO_BYTES } from "@/lib/uploads";

export const dynamic = "force-dynamic";

// Hands the browser a short-lived token so it can upload straight to Vercel
// Blob. The file never passes through this function, so phone photos and video
// testimonies aren't capped by the 4.5MB request limit. The Studio then saves
// the returned URL through /api/content (action "setUpload").
export async function POST(req: NextRequest) {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await req.json()) as HandleUploadBody;
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let slotId = "";
        try { slotId = String(JSON.parse(clientPayload ?? "{}").slotId ?? ""); } catch { /* fall through */ }
        if (!isValidSlot(slotId)) throw new Error("Unknown photo slot");
        if (!pathname.startsWith("site/")) throw new Error("Bad path");
        return {
          allowedContentTypes: [...Object.keys(IMAGE_TYPES), ...Object.keys(VIDEO_TYPES)],
          maximumSizeInBytes: MAX_VIDEO_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ slotId }),
        };
      },
      // The Studio saves the URL itself once the upload finishes; nothing to do here.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (err) {
    console.error("POST /api/content/upload/client:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 400 });
  }
}
