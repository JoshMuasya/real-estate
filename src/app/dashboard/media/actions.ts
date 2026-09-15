"use server";

import { revalidatePath } from "next/cache";

import { verifyRole } from "@/lib/auth/dal";
import { deleteMediaFile, listMediaFiles, uploadMediaFile, type MediaFile } from "@/lib/firebase/media";

export async function uploadMediaAction(formData: FormData): Promise<{ file: MediaFile }> {
    await verifyRole("admin");
    const file = formData.get("file");
    if (!(file instanceof File)) {
        throw new Error("No file provided.");
    }
    const uploaded = await uploadMediaFile(file);
    revalidatePath("/dashboard/media");
    return { file: uploaded };
}

export async function deleteMediaAction(path: string): Promise<void> {
    await verifyRole("admin");
    await deleteMediaFile(path);
    revalidatePath("/dashboard/media");
}

export async function listMoreMediaAction(pageToken: string): Promise<{ items: MediaFile[]; nextPageToken?: string }> {
    await verifyRole("admin");
    return listMediaFiles(pageToken);
}
