"use server";

import { redirect } from "next/navigation";

import { adminAuth } from "@/lib/firebase/admin";
import { sendPasswordResetEmail, signInWithPassword } from "@/lib/auth/identity";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";
import { z } from "zod";

export type LoginState = { error?: string } | undefined;

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        rememberMe: formData.get("rememberMe") === "on",
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
    }

    const { email, password, rememberMe } = parsed.data;

    const result = await signInWithPassword(email, password);
    if (!result.ok) {
        switch (result.reason) {
            case "user_disabled":
                return { error: "This account has been disabled. Contact an administrator." };
            case "too_many_attempts":
                return { error: "Too many attempts. Please try again shortly." };
            case "invalid_credentials":
                return { error: "Invalid email or password." };
            default:
                return { error: "Something went wrong. Please try again." };
        }
    }

    const decoded = await adminAuth().verifyIdToken(result.idToken);
    if (decoded.role !== "admin" && decoded.role !== "agent") {
        return { error: "This account is not authorized to access the dashboard." };
    }

    await createSession(result.idToken, rememberMe);
    redirect("/dashboard");
}

export type ForgotPasswordState = { sent?: boolean; error?: string } | undefined;

const forgotPasswordSchema = z.object({ email: z.string().trim().email() });

export async function requestPasswordResetAction(
    _prevState: ForgotPasswordState,
    formData: FormData,
): Promise<ForgotPasswordState> {
    const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
    if (!parsed.success) {
        return { error: "Enter a valid email address." };
    }

    await sendPasswordResetEmail(parsed.data.email);
    // Always report success regardless of whether the email is registered,
    // to avoid leaking which accounts exist.
    return { sent: true };
}
