"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2 } from "lucide-react";

import { requestPasswordResetAction, type ForgotPasswordState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SendButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Send reset link
        </Button>
    );
}

export function ForgotPasswordDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [state, formAction] = useActionState<ForgotPasswordState, FormData>(
        requestPasswordResetAction,
        undefined,
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reset your password</DialogTitle>
                    <DialogDescription>
                        Enter the email associated with your account and we&apos;ll send a link to reset your
                        password.
                    </DialogDescription>
                </DialogHeader>

                {state?.sent ? (
                    <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm text-foreground">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>If an account exists for that email, a reset link is on its way.</span>
                    </div>
                ) : (
                    <form action={formAction} className="flex flex-col gap-4">
                        {state?.error ? (
                            <p className="text-sm text-destructive">{state.error}</p>
                        ) : null}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <Input id="reset-email" name="email" type="email" required autoComplete="email" />
                        </div>
                        <DialogFooter>
                            <SendButton />
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
