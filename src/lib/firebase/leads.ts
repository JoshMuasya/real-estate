import "server-only";
import { nanoid } from "nanoid";
import { FieldValue, type DocumentSnapshot, type Query, type Timestamp } from "firebase-admin/firestore";

import type { Lead, LeadCategory, LeadFormType, LeadStatus } from "@/lib/types";
import { adminDb } from "./admin";

const COLLECTION = "leads";

interface LeadDoc {
    category: LeadCategory;
    formType: LeadFormType;
    name: string;
    email: string;
    phone: string;
    message: string;
    subject?: string;
    propertyId?: string;
    propertySlug?: string;
    status: LeadStatus;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

function toLead(doc: DocumentSnapshot): Lead {
    const data = doc.data() as LeadDoc;
    const now = new Date().toISOString();
    return {
        id: doc.id,
        category: data.category,
        formType: data.formType,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        subject: data.subject,
        propertyId: data.propertyId,
        propertySlug: data.propertySlug,
        status: data.status,
        createdAt: data.createdAt?.toDate().toISOString() ?? now,
        updatedAt: data.updatedAt?.toDate().toISOString() ?? now,
    };
}

function sortByCreatedAtDesc(a: Lead, b: Lead): number {
    return b.createdAt.localeCompare(a.createdAt);
}

// ---------------------------------------------------------------------------
// Public write — safe to call from an unauthenticated Server Action.
// ---------------------------------------------------------------------------

export type LeadInput = Omit<Lead, "id" | "status" | "createdAt" | "updatedAt">;

export async function createLead(input: LeadInput): Promise<Lead> {
    const ref = adminDb().collection(COLLECTION).doc(nanoid(12));
    await ref.set({
        ...input,
        status: "new" satisfies LeadStatus,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    });
    const saved = await ref.get();
    return toLead(saved);
}

// ---------------------------------------------------------------------------
// Dashboard reads/writes — callers MUST call verifyRole() themselves first.
// ---------------------------------------------------------------------------

export interface LeadListFilters {
    category?: LeadCategory;
    status?: LeadStatus;
    search?: string;
    sort?: "newest" | "oldest";
    page?: number;
    pageSize?: number;
}

export async function getLeads(filters: LeadListFilters = {}): Promise<{ items: Lead[]; total: number }> {
    let query: Query = adminDb().collection(COLLECTION);
    if (filters.category) query = query.where("category", "==", filters.category);
    if (filters.status) query = query.where("status", "==", filters.status);

    const snap = await query.get();
    let items = snap.docs.map(toLead);

    if (filters.search?.trim()) {
        const q = filters.search.trim().toLowerCase();
        items = items.filter(
            (lead) =>
                lead.name.toLowerCase().includes(q) ||
                lead.email.toLowerCase().includes(q) ||
                lead.phone.toLowerCase().includes(q),
        );
    }

    items.sort(filters.sort === "oldest" ? (a, b) => a.createdAt.localeCompare(b.createdAt) : sortByCreatedAtDesc);

    const total = items.length;
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = filters.pageSize ?? 20;
    const start = (page - 1) * pageSize;

    return { items: items.slice(start, start + pageSize), total };
}

export async function getLeadById(id: string): Promise<Lead | undefined> {
    const doc = await adminDb().collection(COLLECTION).doc(id).get();
    if (!doc.exists) return undefined;
    return toLead(doc);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
    await adminDb()
        .collection(COLLECTION)
        .doc(id)
        .update({ status, updatedAt: FieldValue.serverTimestamp() });
}

export async function deleteLead(id: string): Promise<void> {
    await adminDb().collection(COLLECTION).doc(id).delete();
}
