import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getAdminApp(): App {
    const existing = getApps();
    if (existing.length) return existing[0];

    return initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
}

export function adminAuth() {
    return getAuth(getAdminApp());
}

export function adminDb() {
    const db = getFirestore(getAdminApp());
    try {
        // Firestore only allows settings() once, before any other call on the instance.
        // The underlying client can outlive this module (e.g. dev server hot-reloads),
        // so a second call here is expected in some cases and safe to ignore.
        // preferRest avoids gRPC, which does not reliably survive Vercel's serverless
        // function runtime (works in `next dev` and at build time, fails at request time).
        db.settings({ ignoreUndefinedProperties: true, preferRest: true });
    } catch {}
    return db;
}

export function adminBucket() {
    return getStorage(getAdminApp()).bucket();
}
