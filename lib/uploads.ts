import { promises as fs } from "node:fs";
import path from "node:path";

// ============================================================================
// Photo uploads. Vercel Blob in production (the filesystem there is wiped on
// every deploy); a plain /public/uploads folder locally, so the Studio works
// offline with no keys — same pattern as mock Xendit / safe-mode GHL.
//   Production setup: `npm i @vercel/blob`, then set BLOB_READ_WRITE_TOKEN.
// ============================================================================

const MAX_BYTES = 8 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif",
};

export function uploadError(file: { type: string; size: number }): string | null {
  if (!TYPES[file.type]) return "Please upload a JPG, PNG, WebP or AVIF image.";
  if (file.size > MAX_BYTES) return "That image is larger than 8MB. Please export a smaller version.";
  return null;
}

/** Stores the bytes and returns the public URL to render. */
export async function putUpload(slotId: string, type: string, bytes: Buffer): Promise<string> {
  const safeSlot = slotId.replace(/[^a-z0-9_-]/gi, "").slice(0, 60) || "photo";
  const name = `${safeSlot}-${Date.now()}.${TYPES[type] ?? "jpg"}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Variable specifier: @vercel/blob is an optional production-only dep.
    const pkg = "@vercel/blob";
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const blob: any = await import(/* webpackIgnore: true */ pkg);
    const res = await blob.put(`site/${name}`, bytes, {
      access: "public",
      contentType: type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return res.url as string;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}
