import "server-only";

import { adminDb } from "./admin";

export function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-+|-+$)/g, "");
}

export async function uniqueSlug(collection: string, base: string, excludeId?: string): Promise<string> {
    let candidate = base || collection;
    let suffix = 2;
    for (;;) {
        const snap = await adminDb().collection(collection).where("slug", "==", candidate).limit(2).get();
        const clash = snap.docs.some((doc) => doc.id !== excludeId);
        if (!clash) return candidate;
        candidate = `${base}-${suffix}`;
        suffix += 1;
    }
}
