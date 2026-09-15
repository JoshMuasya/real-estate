import "server-only";
import {
    FieldValue,
    type DocumentSnapshot,
    type Query,
    type Timestamp,
} from "firebase-admin/firestore";

import type { Article } from "@/lib/types";
import { adminDb } from "./admin";
import { slugify, uniqueSlug } from "./slug";
import { deleteImageByUrl, uploadImage } from "./storage-images";

const COLLECTION = "articles";

interface ArticleDoc {
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    image: string;
    featured: boolean;
    published: boolean;
    body: string[];
    readingTime: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

function toArticle(doc: DocumentSnapshot): Article {
    const data = doc.data() as ArticleDoc;
    const now = new Date().toISOString();
    const createdAt = data.createdAt?.toDate().toISOString() ?? now;
    return {
        id: doc.id,
        slug: data.slug,
        title: data.title,
        category: data.category,
        date: createdAt,
        readingTime: data.readingTime,
        excerpt: data.excerpt,
        image: data.image,
        featured: data.featured,
        published: data.published,
        body: data.body ?? [],
        createdAt,
        updatedAt: data.updatedAt?.toDate().toISOString() ?? now,
    };
}

function sortByCreatedAtDesc(a: Article, b: Article): number {
    return b.createdAt.localeCompare(a.createdAt);
}

function computeReadingTime(body: string[]): string {
    const wordCount = body.reduce((total, paragraph) => total + paragraph.split(/\s+/).filter(Boolean).length, 0);
    const minutes = Math.max(1, Math.round(wordCount / 200));
    return `${minutes} min read`;
}

// ---------------------------------------------------------------------------
// Public-site reads — safe to call from Server Components rendered for any visitor.
// ---------------------------------------------------------------------------

export async function getPublishedArticles(): Promise<Article[]> {
    const snap = await adminDb().collection(COLLECTION).where("published", "==", true).get();
    return snap.docs.map(toArticle).sort(sortByCreatedAtDesc);
}

export async function getFeaturedPublishedArticles(limitCount = 3): Promise<Article[]> {
    const all = await getPublishedArticles();
    return all.filter((a) => a.featured).slice(0, limitCount);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    const snap = await adminDb()
        .collection(COLLECTION)
        .where("slug", "==", slug)
        .where("published", "==", true)
        .limit(1)
        .get();
    if (snap.empty) return undefined;
    return toArticle(snap.docs[0]);
}

/** No published filter. Only ever call this after verifying a staff session — see the preview flow. */
export async function getArticleBySlugUnfiltered(slug: string): Promise<Article | undefined> {
    const snap = await adminDb().collection(COLLECTION).where("slug", "==", slug).limit(1).get();
    if (snap.empty) return undefined;
    return toArticle(snap.docs[0]);
}

// ---------------------------------------------------------------------------
// Dashboard reads — callers MUST call verifySession()/verifyRole() themselves first.
// ---------------------------------------------------------------------------

export interface ArticleListFilters {
    search?: string;
    published?: boolean;
    category?: string;
    sort?: "newest" | "oldest" | "title";
    page?: number;
    pageSize?: number;
}

export async function getAllArticles(
    filters: ArticleListFilters = {},
): Promise<{ items: Article[]; total: number }> {
    let query: Query = adminDb().collection(COLLECTION);
    if (filters.published !== undefined) query = query.where("published", "==", filters.published);
    if (filters.category) query = query.where("category", "==", filters.category);

    const snap = await query.get();
    let items = snap.docs.map(toArticle);

    if (filters.search?.trim()) {
        const q = filters.search.trim().toLowerCase();
        items = items.filter(
            (a) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q),
        );
    }

    switch (filters.sort) {
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

export async function getArticleById(id: string): Promise<Article | undefined> {
    const doc = await adminDb().collection(COLLECTION).doc(id).get();
    if (!doc.exists) return undefined;
    return toArticle(doc);
}

// ---------------------------------------------------------------------------
// Dashboard writes — callers MUST call verifyRole() themselves first.
// ---------------------------------------------------------------------------

export type ArticleInput = Omit<Article, "id" | "date" | "readingTime" | "createdAt" | "updatedAt">;

export async function createArticle(id: string, input: ArticleInput): Promise<Article> {
    const base = slugify(input.slug?.trim() || input.title);
    const slug = await uniqueSlug(COLLECTION, base);
    const ref = adminDb().collection(COLLECTION).doc(id);
    await ref.set({
        ...input,
        slug,
        readingTime: computeReadingTime(input.body),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    });
    const saved = await ref.get();
    return toArticle(saved);
}

export async function updateArticle(id: string, input: Partial<ArticleInput>): Promise<Article> {
    const ref = adminDb().collection(COLLECTION).doc(id);
    const update: Record<string, unknown> = { ...input, updatedAt: FieldValue.serverTimestamp() };

    if (input.body) {
        update.readingTime = computeReadingTime(input.body);
    }

    if (input.slug?.trim() || input.title) {
        const current = await ref.get();
        const currentData = current.data() as ArticleDoc | undefined;
        const base = slugify(input.slug?.trim() || input.title || currentData?.title || "");
        update.slug = await uniqueSlug(COLLECTION, base, id);
    }

    await ref.update(update);
    const saved = await ref.get();
    return toArticle(saved);
}

export async function deleteArticle(id: string): Promise<void> {
    const ref = adminDb().collection(COLLECTION).doc(id);
    const doc = await ref.get();
    if (doc.exists) {
        const data = doc.data() as ArticleDoc;
        if (data.image) {
            await deleteArticleImage(data.image).catch(() => undefined);
        }
    }
    await ref.delete();
}

export async function setArticlePublished(id: string, published: boolean): Promise<void> {
    await adminDb()
        .collection(COLLECTION)
        .doc(id)
        .update({ published, updatedAt: FieldValue.serverTimestamp() });
}

export async function setArticleFeatured(id: string, featured: boolean): Promise<void> {
    await adminDb()
        .collection(COLLECTION)
        .doc(id)
        .update({ featured, updatedAt: FieldValue.serverTimestamp() });
}

// ---------------------------------------------------------------------------
// Storage — article images
// ---------------------------------------------------------------------------

export async function uploadArticleImage(articleId: string, file: File): Promise<string> {
    return uploadImage(`articles/${articleId}`, file);
}

export async function deleteArticleImage(url: string): Promise<void> {
    return deleteImageByUrl(url);
}
