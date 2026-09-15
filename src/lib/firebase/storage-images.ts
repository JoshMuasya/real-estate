import "server-only";
import { nanoid } from "nanoid";

import { adminBucket } from "./admin";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

/** Uploads under `${prefix}/${nanoid(12)}.${ext}` and returns the public URL. */
export async function uploadImage(prefix: string, file: File): Promise<string> {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        throw new Error("Unsupported image type. Use JPEG, PNG, WEBP, or AVIF.");
    }
    if (file.size > MAX_IMAGE_BYTES) {
        throw new Error("Image is too large. Maximum size is 8MB.");
    }

    const bucket = adminBucket();
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${prefix}/${nanoid(12)}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const storageFile = bucket.file(path);

    await storageFile.save(buffer, { contentType: file.type || "image/jpeg" });
    await storageFile.makePublic();

    return `https://storage.googleapis.com/${bucket.name}/${path}`;
}

export async function deleteImageByUrl(url: string): Promise<void> {
    const bucket = adminBucket();
    const prefix = `https://storage.googleapis.com/${bucket.name}/`;
    if (!url.startsWith(prefix)) return;
    const path = url.slice(prefix.length);
    await bucket.file(path).delete({ ignoreNotFound: true });
}
