import "server-only";
import { nanoid } from "nanoid";
import {
    FieldValue,
    type DocumentSnapshot,
    type Query,
    type Timestamp,
} from "firebase-admin/firestore";

import type { Agent, Property, PropertyStatus, TransactionType } from "@/lib/types";
import { adminDb } from "./admin";
import { slugify, uniqueSlug } from "./slug";
import { deleteImageByUrl, uploadImage } from "./storage-images";

const COLLECTION = "properties";

interface PropertyDoc {
    title: string;
    slug: string;
    location: string;
    propertyType: string;
    transactionType: TransactionType;
    price: number;
    currency: string;
    bedrooms: number;
    bathrooms: number;
    parking: number;
    area: number;
    landSize?: number;
    description: string;
    features: string[];
    amenities: string[];
    images: string[];
    status: PropertyStatus;
    featured: boolean;
    published: boolean;
    agent: Agent;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

function toProperty(doc: DocumentSnapshot): Property {
    const data = doc.data() as PropertyDoc;
    const now = new Date().toISOString();
    return {
        id: doc.id,
        title: data.title,
        slug: data.slug,
        location: data.location,
        propertyType: data.propertyType,
        transactionType: data.transactionType,
        price: data.price,
        currency: data.currency,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        parking: data.parking,
        area: data.area,
        landSize: data.landSize,
        description: data.description,
        features: data.features ?? [],
        amenities: data.amenities ?? [],
        images: data.images ?? [],
        status: data.status,
        featured: data.featured,
        published: data.published,
        agent: data.agent,
        createdAt: data.createdAt?.toDate().toISOString() ?? now,
        updatedAt: data.updatedAt?.toDate().toISOString() ?? now,
    };
}

function sortByCreatedAtDesc(a: Property, b: Property): number {
    return b.createdAt.localeCompare(a.createdAt);
}

// ---------------------------------------------------------------------------
// Public-site reads — safe to call from Server Components rendered for any visitor.
// ---------------------------------------------------------------------------

export async function getPublishedProperties(): Promise<Property[]> {
    const snap = await adminDb().collection(COLLECTION).where("published", "==", true).get();
    return snap.docs.map(toProperty).sort(sortByCreatedAtDesc);
}

export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
    const snap = await adminDb()
        .collection(COLLECTION)
        .where("slug", "==", slug)
        .where("published", "==", true)
        .limit(1)
        .get();
    if (snap.empty) return undefined;
    return toProperty(snap.docs[0]);
}

/** No published filter. Only ever call this after verifying a staff session — see the preview flow. */
export async function getPropertyBySlugUnfiltered(slug: string): Promise<Property | undefined> {
    const snap = await adminDb().collection(COLLECTION).where("slug", "==", slug).limit(1).get();
    if (snap.empty) return undefined;
    return toProperty(snap.docs[0]);
}

export async function getFeaturedPublishedProperties(limitCount = 3): Promise<Property[]> {
    const all = await getPublishedProperties();
    return all.filter((p) => p.featured).slice(0, limitCount);
}

export async function getSimilarPublishedProperties(property: Property, limitCount = 2): Promise<Property[]> {
    const all = await getPublishedProperties();
    return all.filter((p) => p.id !== property.id && p.location === property.location).slice(0, limitCount);
}

export async function getStaticPropertySlugs(): Promise<string[]> {
    const all = await getPublishedProperties();
    return all.map((p) => p.slug);
}

// ---------------------------------------------------------------------------
// Dashboard reads — callers MUST call verifySession()/verifyRole() themselves first.
// ---------------------------------------------------------------------------

export interface PropertyListFilters {
    search?: string;
    status?: PropertyStatus;
    published?: boolean;
    featured?: boolean;
    propertyType?: string;
    location?: string;
    sort?: "newest" | "oldest" | "price-asc" | "price-desc" | "title";
    page?: number;
    pageSize?: number;
}

export async function getAllProperties(
    filters: PropertyListFilters = {},
): Promise<{ items: Property[]; total: number }> {
    let query: Query = adminDb().collection(COLLECTION);
    if (filters.status) query = query.where("status", "==", filters.status);
    if (filters.published !== undefined) query = query.where("published", "==", filters.published);
    if (filters.featured !== undefined) query = query.where("featured", "==", filters.featured);
    if (filters.propertyType) query = query.where("propertyType", "==", filters.propertyType);
    if (filters.location) query = query.where("location", "==", filters.location);

    const snap = await query.get();
    let items = snap.docs.map(toProperty);

    if (filters.search?.trim()) {
        const q = filters.search.trim().toLowerCase();
        items = items.filter(
            (p) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q),
        );
    }

    switch (filters.sort) {
        case "price-asc":
            items.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            items.sort((a, b) => b.price - a.price);
            break;
        case "title":
            items.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "oldest":
            items.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            break;
        case "newest":
        default:
            items.sort(sortByCreatedAtDesc);
    }

    const total = items.length;
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = filters.pageSize ?? 20;
    const start = (page - 1) * pageSize;

    return { items: items.slice(start, start + pageSize), total };
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
    const doc = await adminDb().collection(COLLECTION).doc(id).get();
    if (!doc.exists) return undefined;
    return toProperty(doc);
}

export async function getPropertyKpis(): Promise<{ total: number; published: number; featured: number }> {
    const snap = await adminDb().collection(COLLECTION).get();
    let total = 0;
    let published = 0;
    let featured = 0;
    snap.forEach((doc) => {
        const data = doc.data() as PropertyDoc;
        total += 1;
        if (data.published) published += 1;
        if (data.featured) featured += 1;
    });
    return { total, published, featured };
}

// ---------------------------------------------------------------------------
// Dashboard writes — callers MUST call verifyRole() themselves first.
// ---------------------------------------------------------------------------

export type PropertyInput = Omit<Property, "id" | "createdAt" | "updatedAt">;

export async function createProperty(id: string, input: PropertyInput): Promise<Property> {
    const base = slugify(input.slug?.trim() || input.title);
    const slug = await uniqueSlug(COLLECTION, base);
    const ref = adminDb().collection(COLLECTION).doc(id);
    await ref.set({
        ...input,
        slug,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    });
    const saved = await ref.get();
    return toProperty(saved);
}

export async function updateProperty(id: string, input: Partial<PropertyInput>): Promise<Property> {
    const ref = adminDb().collection(COLLECTION).doc(id);
    const update: Record<string, unknown> = { ...input, updatedAt: FieldValue.serverTimestamp() };

    if (input.slug?.trim() || input.title) {
        const current = await ref.get();
        const currentData = current.data() as PropertyDoc | undefined;
        const base = slugify(input.slug?.trim() || input.title || currentData?.title || "");
        update.slug = await uniqueSlug(COLLECTION, base, id);
    }

    await ref.update(update);
    const saved = await ref.get();
    return toProperty(saved);
}

export async function deleteProperty(id: string): Promise<void> {
    const ref = adminDb().collection(COLLECTION).doc(id);
    const doc = await ref.get();
    if (doc.exists) {
        const data = doc.data() as PropertyDoc;
        await Promise.all((data.images ?? []).map((url) => deletePropertyImage(url).catch(() => undefined)));
    }
    await ref.delete();
}

export async function duplicateProperty(id: string): Promise<Property> {
    const original = await getPropertyById(id);
    if (!original) throw new Error("Property not found");

    const { slug, ...rest } = original;
    const newId = nanoid(10);
    return createProperty(newId, {
        ...rest,
        slug: `${slug}-copy`,
        published: false,
        featured: false,
    });
}

export async function setPublished(ids: string[], published: boolean): Promise<void> {
    const db = adminDb();
    const batch = db.batch();
    ids.forEach((id) => {
        batch.update(db.collection(COLLECTION).doc(id), {
            published,
            updatedAt: FieldValue.serverTimestamp(),
        });
    });
    await batch.commit();
}

export async function setFeatured(id: string, featured: boolean): Promise<void> {
    await adminDb()
        .collection(COLLECTION)
        .doc(id)
        .update({ featured, updatedAt: FieldValue.serverTimestamp() });
}

// ---------------------------------------------------------------------------
// Storage — property images
// ---------------------------------------------------------------------------

export async function uploadPropertyImage(propertyId: string, file: File): Promise<string> {
    return uploadImage(`properties/${propertyId}`, file);
}

export async function deletePropertyImage(url: string): Promise<void> {
    return deleteImageByUrl(url);
}
