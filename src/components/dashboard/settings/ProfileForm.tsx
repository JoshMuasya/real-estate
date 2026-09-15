"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { changePasswordAction, updateProfileAction, type SettingsActionState } from "@/app/dashboard/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SessionUser } from "@/lib/types";

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="size-4 animate-spin" />
                    {pendingLabel}
                </>
            ) : (
                label
            )}
        </Button>
    );
}

export function ProfileForm({ user }: { user: SessionUser }) {
    return (
        <div className="space-y-6">
            <NameForm user={user} />
            <PasswordForm />
        </div>
    );
}

function NameForm({ user }: { user: SessionUser }) {
    const [state, formAction] = useActionState<SettingsActionState, FormData>(updateProfileAction, undefined);

    useEffect(() => {
        if (state?.success) toast.success("Profile updated");
    }, [state]);

    return (
        <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl text-foreground">Profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">Update your display name.</p>

            <form action={formAction} className="mt-6 flex max-w-sm flex-col gap-4" noValidate>
                {state?.error ? (
                    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        <span>{state.error}</span>
                    </div>
                ) : null}

                <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={user.name ?? ""} required />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled />
                </div>

                <div>
                    <SubmitButton label="Save changes" pendingLabel="Saving…" />
                </div>
            </form>
        </div>
    );
}

function PasswordForm() {
    const [state, formAction] = useActionState<SettingsActionState, FormData>(changePasswordAction, undefined);

    return (
        <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl text-foreground">Password</h2>
            <p className="mt-1 text-sm text-muted-foreground">Change your account password.</p>

            <form action={formAction} className="mt-6 flex max-w-sm flex-col gap-4" noValidate key={state?.success ? "reset" : "form"}>
                {state?.error ? (
                    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        <span>{state.error}</span>
                    </div>
                ) : null}

                {state?.success ? (
                    <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm text-foreground">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>Password updated.</span>
                    </div>
                ) : null}

                <div className="flex flex-col gap-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
                </div>

                <div>
                    <SubmitButton label="Update password" pendingLabel="Updating…" />
                </div>
            </form>
        </div>
    );
}
