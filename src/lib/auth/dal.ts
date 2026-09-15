import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";

import { adminAuth } from "@/lib/firebase/admin";
import type { SessionUser, UserRole } from "@/lib/types";
import { getSessionCookie } from "./session";

const VALID_ROLES: UserRole[] = ["admin", "agent"];

function isUserRole(value: unknown): value is UserRole {
    return typeof value === "string" && (VALID_ROLES as string[]).includes(value);
}

/**
 * The real, non-bypassable authentication check. Cryptographically verifies
 * the session cookie (with revocation checking) against Firebase Auth.
 * Redirects to /login on any failure. Memoized per-request via cache() so
 * multiple call sites (layout, page, topbar) cost one Admin SDK round trip.
 */
export const verifySession = cache(async (): Promise<SessionUser> => {
    const cookie = await getSessionCookie();
    if (!cookie) redirect("/login");

    try {
        const decoded = await adminAuth().verifySessionCookie(cookie, true);
        const role = decoded.role;
        if (!isUserRole(role)) redirect("/login");

        return {
            uid: decoded.uid,
            email: decoded.email ?? "",
            role,
            name: typeof decoded.name === "string" ? decoded.name : undefined,
        };
    } catch {
        redirect("/login");
    }
});

/** Same verification as verifySession, but returns null instead of redirecting. Preview flow only. */
export async function getOptionalSession(): Promise<SessionUser | null> {
    const cookie = await getSessionCookie();
    if (!cookie) return null;

    try {
        const decoded = await adminAuth().verifySessionCookie(cookie, true);
        const role = decoded.role;
        if (!isUserRole(role)) return null;

        return {
            uid: decoded.uid,
            email: decoded.email ?? "",
            role,
            name: typeof decoded.name === "string" ? decoded.name : undefined,
        };
    } catch {
        return null;
    }
}

/** Verifies the session AND that the role is one of the permitted roles. Redirects to /dashboard otherwise. */
export async function verifyRole(...roles: UserRole[]): Promise<SessionUser> {
    const user = await verifySession();
    if (!roles.includes(user.role)) redirect("/dashboard");
    return user;
}
