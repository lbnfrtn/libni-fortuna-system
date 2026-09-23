import { promises as fs } from "node:fs";
import path from "node:path";

// ============================================================================
// Photo and video uploads.
//
// In production the browser uploads STRAIGHT to Vercel Blob (see
// app/api/content/upload/client/route.ts), which sidesteps the 4.5MB request
// limit on serverless functions and lets phone photos and video testimonies
// through. This server path is the local fallback: a plain /public/uploads
// folder, so the Studio works offline with no keys — same pattern as mock
// Xendit / safe-mode GHL. It also still works on Vercel for small files.
// ============================================================================

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "image/heic": "heic",
};
export const VIDEO_TYPES: Record<string, string> = {
  "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov", "video/x-m4v": "m4v",
};
const TYPES = { ...IMAGE_TYPES, ...VIDEO_TYPES };

/** Generous ceilings; the direct-to-Blob path enforces the same numbers. */
export const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

export function uploadError(file: { type: string; size: number }): string | null {
  if (VIDEO_TYPES[file.type]) {
    if (file.size > MAX_VIDEO_BYTES) return "That video is larger than 500MB. Please export a smaller version (1080p is plenty).";
    return null;
  }
  if (!IMAGE_TYPES[file.type]) return "Please upload a JPG, PNG, WebP, AVIF or HEIC image, or an MP4 / MOV video.";
  if (file.size > MAX_IMAGE_BYTES) return "That image is larger than 25MB. Please export a smaller version.";
  return null;
}

export const usingBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

/** True when the URL points at our public Blob store (or a local upload) — the only URLs the Studio may save from a direct upload. */
export function isOurUploadUrl(url: string): boolean {
  if (url.startsWith("/uploads/")) return true;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/** Stores the bytes and returns the public URL to render. */
export async function putUpload(slotId: string, type: string, bytes: Buffer): Promise<string> {
  const safeSlot = slotId.replace(/[^a-z0-9_-]/gi, "").slice(0, 60) || "photo";
  const name = `${safeSlot}-${Date.now()}.${TYPES[type] ?? "jpg"}`;

  // A connected store authenticates either by OIDC (BLOB_STORE_ID, which the
  // SDK pairs with a rotating token it manages) or by a static read-write token.
  if (usingBlob()) {
    // Variable specifier: @vercel/blob is an optional production-only dep.
    const pkg = "@vercel/blob";
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const blob: any = await import(/* webpackIgnore: true */ pkg);
    // Site photos are rendered via <img src>, so the store must be PUBLIC.
    const res = await blob.put(`site/${name}`, bytes, {
      access: "public",
      contentType: type,
      ...(process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {}),
    });
    return res.url as string;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}
