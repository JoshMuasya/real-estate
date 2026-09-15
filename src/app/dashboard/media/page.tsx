import type { Metadata } from "next";

import { verifyRole } from "@/lib/auth/dal";
import { listMediaFiles } from "@/lib/firebase/media";
import { MediaLibraryClient } from "@/components/dashboard/media/MediaLibraryClient";

export const metadata: Metadata = {
    title: "Media Library",
    description: "Browse, upload and manage files stored in Firebase Storage.",
};

export default async function MediaLibraryPage() {
    await verifyRole("admin");
    const { items, nextPageToken } = await listMediaFiles();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-2xl text-foreground">Media Library</h1>
                <p className="mt-1 text-muted-foreground">Browse, upload, and manage files stored in Firebase Storage.</p>
            </div>

            <MediaLibraryClient initialItems={items} initialNextPageToken={nextPageToken} />
        </div>
    );
}
