import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

/**
 * Optimistic-only check (cookie presence, no cryptographic verification) for
 * fast redirects. The real, non-bypassable check is verifySession() in
 * src/lib/auth/dal.ts, called from src/app/dashboard/layout.tsx — see that
 * file for why Proxy is not the security boundary on its own.
 *
 * /login is deliberately not matched here. Bouncing it to /dashboard on cookie
 * presence alone redirects forever whenever the cookie exists but no longer
 * verifies (expired, revoked, or the deployment is missing Firebase Admin
 * credentials), because verifySession sends that request straight back to
 * /login. The login page does the real, verified check instead.
 */
export function proxy(request: NextRequest) {
    const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/dashboard") && !hasSession) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
