import "server-only";

const IDENTITY_TOOLKIT_BASE = "https://identitytoolkit.googleapis.com/v1";

export type SignInResult =
    | { ok: true; idToken: string; uid: string }
    | {
          ok: false;
          reason: "invalid_credentials" | "user_disabled" | "too_many_attempts" | "unknown";
      };

interface IdentityErrorBody {
    error?: { message?: string };
}

function apiKey(): string {
    const key = process.env.FIREBASE_WEB_API_KEY;
    if (!key) throw new Error("FIREBASE_WEB_API_KEY is not configured.");
    return key;
}

/**
 * A single Firebase project can return either the legacy per-field codes
 * (EMAIL_NOT_FOUND / INVALID_PASSWORD) or the newer unified
 * INVALID_LOGIN_CREDENTIALS, depending on project settings. Both are treated
 * identically so the UI never leaks which part of the credential was wrong.
 */
const INVALID_CREDENTIAL_CODES = new Set([
    "EMAIL_NOT_FOUND",
    "INVALID_PASSWORD",
    "INVALID_LOGIN_CREDENTIALS",
]);

export async function signInWithPassword(email: string, password: string): Promise<SignInResult> {
    const response = await fetch(
        `${IDENTITY_TOOLKIT_BASE}/accounts:signInWithPassword?key=${apiKey()}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
        },
    );

    if (response.ok) {
        const data = (await response.json()) as { idToken: string; localId: string };
        return { ok: true, idToken: data.idToken, uid: data.localId };
    }

    const body = (await response.json().catch(() => ({}))) as IdentityErrorBody;
    const code = body.error?.message ?? "";

    if (INVALID_CREDENTIAL_CODES.has(code)) return { ok: false, reason: "invalid_credentials" };
    if (code === "USER_DISABLED") return { ok: false, reason: "user_disabled" };
    if (code === "TOO_MANY_ATTEMPTS_TRY_LATER") return { ok: false, reason: "too_many_attempts" };
    return { ok: false, reason: "unknown" };
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
    await fetch(`${IDENTITY_TOOLKIT_BASE}/accounts:sendOobCode?key=${apiKey()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestType: "PASSWORD_RESET", email }),
    });
    // Intentionally ignore the response body/status: reveal nothing about
    // whether the email is registered, to avoid account enumeration.
}
