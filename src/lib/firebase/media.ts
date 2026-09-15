import "server-only";

import { adminBucket } from "./admin";
import { uploadImage } from "./storage-images";

const MEDIA_PREFIX = "media/";

export interface MediaFile {
    name: string;
    url: string;
    size: number;
    contentType: string;
    updated: string;
}

export async function listMediaFiles(pageToken?: string): Promise<{ items: MediaFile[]; nextPageToken?: string }> {
    const bucket = adminBucket();
    const [files, nextQuery] = await bucket.getFiles({
        prefix: MEDIA_PREFIX,
        maxResults: 40,
        pageToken,
        autoPaginate: false,
    });

    const items = files.map((file) => ({
        name: file.name.slice(MEDIA_PREFIX.length),
        url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
        size: Number(file.metadata.size ?? 0),
        contentType: file.metadata.contentType ?? "application/octet-stream",
        updated: file.metadata.updated ?? new Date().toISOString(),
    }));

    return { items, nextPageToken: nextQuery?.pageToken };
}

export async function uploadMediaFile(file: File): Promise<MediaFile> {
    const url = await uploadImage("media", file);
    return {
        name: url.split("/").pop() ?? file.name,
        url,
        size: file.size,
        contentType: file.type,
        updated: new Date().toISOString(),
    };
}

export async function deleteMediaFile(path: string): Promise<void> {
    await adminBucket().file(path).delete({ ignoreNotFound: true });
}
