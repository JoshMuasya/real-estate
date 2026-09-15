import "server-only";
import { FieldValue, type DocumentSnapshot, type Timestamp } from "firebase-admin/firestore";

import type { FeaturedLocation } from "@/lib/types";
import { adminDb } from "./admin";
import { slugify, uniqueSlug } from "./slug";
import { deleteImageByUrl, uploadImage } from "./storage-images";

const COLLECTION = "locations";

interface LocationDoc {
    name: string;
    slug: string;
    description: string;
    image: string;
    published: boolean;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

function toLocation(doc: DocumentSnapshot): FeaturedLocation {
    const data = doc.data() as LocationDoc;
    const now = new Date().toISOString();
    return {
        id: doc.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        published: data.published,
        createdAt: data.createdAt?.toDate().toISOString() ?? now,
        updatedAt: data.updatedAt?.toDate().toISOString() ?? now,
    };
}

function sortByCreatedAtDesc(a: FeaturedLocation, b: FeaturedLocation): number {
    return b.createdAt.localeCompare(a.createdAt);
}

// ---------------------------------------------------------------------------
// Public-site reads — safe to call from Server Components rendered for any visitor.
// ---------------------------------------------------------------------------

export async function getPublishedLocations(): Promise<FeaturedLocation[]> {
    const snap = await adminDb().collection(COLLECTION).where("published", "==", true).get();
    return snap.docs.map(toLocation).sort(sortByCreatedAtDesc);
}

// ---------------------------------------------------------------------------
// Dashboard reads — callers MUST call verifyRole() themselves first.
// ---------------------------------------------------------------------------

export async function getAllLocations(): Promise<FeaturedLocation[]> {
    const snap = await adminDb().collection(COLLECTION).get();
    return snap.docs.map(toLocation).sort(sortByCreatedAtDesc);
}

export async function getLocationById(id: string): Promise<FeaturedLocation | undefined> {
    const doc = await adminDb().collection(COLLECTION).doc(id).get();
    if (!doc.exists) return undefined;
    return toLocation(doc);
}

// ---------------------------------------------------------------------------
// Dashboard writes — callers MUST call verifyRole() themselves first.
// ---------------------------------------------------------------------------

export type LocationInput = Omit<FeaturedLocation, "id" | "createdAt" | "updatedAt">;

export async function createLocation(id: string, input: LocationInput): Promise<FeaturedLocation> {
    const base = slugify(input.slug?.trim() || input.name);
    const slug = await uniqueSlug(COLLECTION, base);
    const ref = adminDb().collection(COLLECTION).doc(id);
    await ref.set({
        ...input,
        slug,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    });
    const saved = await ref.get();
    return toLocation(saved);
}

export async function updateLocation(id: string, input: Partial<LocationInput>): Promise<FeaturedLocation> {
    const ref = adminDb().collection(COLLECTION).doc(id);
    const update: Record<string, unknown> = { ...input, updatedAt: FieldValue.serverTimestamp() };

    if (input.slug?.trim() || input.name) {
        const current = await ref.get();
        const currentData = current.data() as LocationDoc | undefined;
        const base = slugify(input.slug?.trim() || input.name || currentData?.name || "");
        update.slug = await uniqueSlug(COLLECTION, base, id);
    }

    await ref.update(update);
    const saved = await ref.get();
    return toLocation(saved);
}

export async function deleteLocation(id: string): Promise<void> {
    const ref = adminDb().collection(COLLECTION).doc(id);
    const doc = await ref.get();
    if (doc.exists) {
        const data = doc.data() as LocationDoc;
        if (data.image) {
            await deleteLocationImage(data.image).catch(() => undefined);
        }
    }
    await ref.delete();
}

export async function setLocationPublished(id: string, published: boolean): Promise<void> {
    await adminDb()
        .collection(COLLECTION)
        .doc(id)
        .update({ published, updatedAt: FieldValue.serverTimestamp() });
}

// ---------------------------------------------------------------------------
// Storage — location images
// ---------------------------------------------------------------------------

export async function uploadLocationImage(locationId: string, file: File): Promise<string> {
    return uploadImage(`locations/${locationId}`, file);
}

export async function deleteLocationImage(url: string): Promise<void> {
    return deleteImageByUrl(url);
}
