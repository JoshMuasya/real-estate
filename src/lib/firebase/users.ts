import "server-only";
import { FieldValue, type Timestamp } from "firebase-admin/firestore";

import type { UserRole } from "@/lib/types";
import { adminDb } from "./admin";

const COLLECTION = "users";

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    role: UserRole;
    photoURL?: string | null;
    createdAt: string;
    updatedAt: string;
}

interface UserProfileDoc {
    email: string;
    name: string;
    role: UserRole;
    photoURL?: string | null;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export async function getUserProfile(uid: string): Promise<UserProfile | undefined> {
    const doc = await adminDb().collection(COLLECTION).doc(uid).get();
    if (!doc.exists) return undefined;
    const data = doc.data() as UserProfileDoc;
    const now = new Date().toISOString();
    return {
        uid: doc.id,
        email: data.email,
        name: data.name,
        role: data.role,
        photoURL: data.photoURL ?? null,
        createdAt: data.createdAt?.toDate().toISOString() ?? now,
        updatedAt: data.updatedAt?.toDate().toISOString() ?? now,
    };
}

export async function upsertUserProfile(
    uid: string,
    input: { email: string; name: string; role: UserRole; photoURL?: string | null },
): Promise<void> {
    const ref = adminDb().collection(COLLECTION).doc(uid);
    const existing = await ref.get();
    await ref.set(
        {
            ...input,
            updatedAt: FieldValue.serverTimestamp(),
            ...(existing.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
        },
        { merge: true },
    );
}

export async function listUserProfiles(): Promise<UserProfile[]> {
    const snapshot = await adminDb().collection(COLLECTION).orderBy("name").get();
    const now = new Date().toISOString();
    return snapshot.docs.map((doc) => {
        const data = doc.data() as UserProfileDoc;
        return {
            uid: doc.id,
            email: data.email,
            name: data.name,
            role: data.role,
            photoURL: data.photoURL ?? null,
            createdAt: data.createdAt?.toDate().toISOString() ?? now,
            updatedAt: data.updatedAt?.toDate().toISOString() ?? now,
        };
    });
}

export async function deleteUserProfile(uid: string): Promise<void> {
    await adminDb().collection(COLLECTION).doc(uid).delete();
}
