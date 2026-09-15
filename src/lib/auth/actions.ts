"use server";

import { redirect } from "next/navigation";

import { adminAuth } from "@/lib/firebase/admin";
import { clearSession, getSessionCookie } from "./session";

export async function logoutAction(): Promise<void> {
    const cookie = await getSessionCookie();
    if (cookie) {
        try {
            const decoded = await adminAuth().verifySessionCookie(cookie);
            await adminAuth().revokeRefreshTokens(decoded.uid);
        } catch {
            // Cookie was already invalid — nothing to revoke, just clear it below.
        }
    }
    await clearSession();
    redirect("/login");
}
