import "server-only";
import { nanoid } from "nanoid";
import { FieldValue, type DocumentSnapshot, type Timestamp } from "firebase-admin/firestore";

import type { Testimonial } from "@/lib/types";
import { adminDb } from "./admin";

const COLLECTION = "testimonials";

interface TestimonialDoc {
    name: string;
    role: string;
    quote: string;
    published: boolean;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

function toTestimonial(doc: DocumentSnapshot): Testimonial {
    const data = doc.data() as TestimonialDoc;
    const now = new Date().toISOString();
    return {
        id: doc.id,
        name: data.name,
        role: data.role,
        quote: data.quote,
        published: data.published,
        createdAt: data.createdAt?.toDate().toISOString() ?? now,
        updatedAt: data.updatedAt?.toDate().toISOString() ?? now,
    };
}

function sortByCreatedAtDesc(a: Testimonial, b: Testimonial): number {
    return b.createdAt.localeCompare(a.createdAt);
}

// ---------------------------------------------------------------------------
// Public-site reads — safe to call from Server Components rendered for any visitor.
// ---------------------------------------------------------------------------

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
    const snap = await adminDb().collection(COLLECTION).where("published", "==", true).get();
    return snap.docs.map(toTestimonial).sort(sortByCreatedAtDesc);
}

// ---------------------------------------------------------------------------
// Dashboard reads/writes — callers MUST call verifyRole() themselves first.
// ---------------------------------------------------------------------------

export async function getAllTestimonials(): Promise<Testimonial[]> {
    const snap = await adminDb().collection(COLLECTION).get();
    return snap.docs.map(toTestimonial).sort(sortByCreatedAtDesc);
}

export type TestimonialInput = Omit<Testimonial, "id" | "createdAt" | "updatedAt">;

export async function createTestimonial(input: TestimonialInput): Promise<Testimonial> {
    const id = nanoid(10);
    const ref = adminDb().collection(COLLECTION).doc(id);
    await ref.set({
        ...input,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    });
    const saved = await ref.get();
    return toTestimonial(saved);
}

export async function updateTestimonial(id: string, input: Partial<TestimonialInput>): Promise<Testimonial> {
    const ref = adminDb().collection(COLLECTION).doc(id);
    await ref.update({ ...input, updatedAt: FieldValue.serverTimestamp() });
    const saved = await ref.get();
    return toTestimonial(saved);
}

export async function deleteTestimonial(id: string): Promise<void> {
    await adminDb().collection(COLLECTION).doc(id).delete();
}
