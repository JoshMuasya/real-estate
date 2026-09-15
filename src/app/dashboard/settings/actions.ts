"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { verifyRole, verifySession } from "@/lib/auth/dal";
import { signInWithPassword } from "@/lib/auth/identity";
import { adminAuth } from "@/lib/firebase/admin";
import { deleteUserProfile, getUserProfile, upsertUserProfile } from "@/lib/firebase/users";
import type { UserRole } from "@/lib/types";
import { passwordSchema, profileSchema } from "@/lib/validation/settings";

export type SettingsActionState = { error?: string; success?: boolean } | undefined;

export async function updateProfileAction(
    _prevState: SettingsActionState,
    formData: FormData,
): Promise<SettingsActionState> {
    const user = await verifySession();
    const parsed = profileSchema.safeParse({ name: formData.get("name") });
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
    }

    const { name } = parsed.data;
    await adminAuth().updateUser(user.uid, { displayName: name });
    await upsertUserProfile(user.uid, { email: user.email, name, role: user.role });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function changePasswordAction(
    _prevState: SettingsActionState,
    formData: FormData,
): Promise<SettingsActionState> {
    const user = await verifySession();
    const parsed = passwordSchema.safeParse({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
    });
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
    }

    const result = await signInWithPassword(user.email, parsed.data.currentPassword);
    if (!result.ok) {
        return { error: "Current password is incorrect." };
    }

    await adminAuth().updateUser(user.uid, { password: parsed.data.newPassword });
    return { success: true };
}

const createTeamMemberSchema = z.object({
    email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    name: z.string().trim().min(1, "Name is required."),
    role: z.enum(["admin", "agent"]),
});

export async function createTeamMemberAction(
    _prevState: SettingsActionState,
    formData: FormData,
): Promise<SettingsActionState> {
    await verifyRole("admin");
    const parsed = createTeamMemberSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        name: formData.get("name"),
        role: formData.get("role"),
    });
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
    }

    const { email, password, name, role } = parsed.data;

    try {
        const created = await adminAuth().createUser({ email, password, displayName: name });
        await adminAuth().setCustomUserClaims(created.uid, { role });
        await upsertUserProfile(created.uid, { email, name, role });
    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: string }).code === "auth/email-already-exists"
        ) {
            return { error: "A user with this email already exists." };
        }
        throw error;
    }

    revalidatePath("/dashboard/settings");
    return { success: true };
}

export async function updateTeamMemberRoleAction(uid: string, role: UserRole): Promise<void> {
    await verifyRole("admin");
    const existing = await getUserProfile(uid);
    await adminAuth().setCustomUserClaims(uid, { role });
    await upsertUserProfile(uid, {
        email: existing?.email ?? "",
        name: existing?.name ?? "",
        role,
    });
    revalidatePath("/dashboard/settings");
}

export async function deleteTeamMemberAction(uid: string): Promise<void> {
    const admin = await verifyRole("admin");
    if (admin.uid === uid) {
        throw new Error("You cannot delete your own account.");
    }

    await adminAuth().deleteUser(uid);
    await deleteUserProfile(uid);
    revalidatePath("/dashboard/settings");
}
