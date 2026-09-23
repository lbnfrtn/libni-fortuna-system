import { NextRequest, NextResponse } from "next/server";
import { issueSignedToken } from "@vercel/blob";
import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { isLoggedIn } from "@/lib/auth";
import { isValidSlot } from "@/config/site-slots";
import { IMAGE_TYPES, VIDEO_TYPES, MAX_VIDEO_BYTES } from "@/lib/uploads";

export const dynamic = "force-dynamic";

// Hands the browser a presigned URL so it can upload straight to Vercel Blob.
// The file never passes through this function, so phone photos and video
// testimonies aren't capped by the 4.5MB request limit. The Studio then saves
// the returned URL through /api/content (action "setUpload").
//
// Why presigned rather than "client tokens": client tokens must be signed with
// a static BLOB_READ_WRITE_TOKEN, but this store is connected by OIDC (no
// static token). issueSignedToken goes through the same OIDC-aware API client
// as `put`, which is how every server-side upload here already works.
export async function POST(req: NextRequest) {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await req.json()) as HandleUploadPresignedBody;
    const json = await handleUploadPresigned({
      body,
      request: req,
      getSignedToken: async (pathname, clientPayload) => {
        let slotId = "";
        try { slotId = String(JSON.parse(clientPayload ?? "{}").slotId ?? ""); } catch { /* fall through */ }
        if (!isValidSlot(slotId)) throw new Error("Unknown photo slot");
        if (!pathname.startsWith("site/")) throw new Error("Bad path");
        const allowedContentTypes = [...Object.keys(IMAGE_TYPES), ...Object.keys(VIDEO_TYPES)];
        const token = await issueSignedToken({
          operations: ["put"],
          pathname,
          allowedContentTypes,
          maximumSizeInBytes: MAX_VIDEO_BYTES,
          validUntil: Date.now() + 60 * 60 * 1000, // an hour: long enough for a 500MB video on a slow connection
        });
        return { token, urlOptions: { allowedContentTypes, maximumSizeInBytes: MAX_VIDEO_BYTES, addRandomSuffix: true } };
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    console.error("POST /api/content/upload/client:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 400 });
  }
}
