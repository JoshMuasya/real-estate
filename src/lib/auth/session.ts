import "server-only";
import { cookies } from "next/headers";

import { adminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "./constants";

export { SESSION_COOKIE_NAME };

const DEFAULT_SESSION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days
const REMEMBER_ME_SESSION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days — Firebase's hard cap

export async function createSession(idToken: string, rememberMe = false): Promise<void> {
    const expiresIn = rememberMe ? REMEMBER_ME_SESSION_MS : DEFAULT_SESSION_MS;
    const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: expiresIn / 1000,
    });
}

export async function clearSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}
