"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Loader2 } from "lucide-react";

import { loginAction, type LoginState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in…
                </>
            ) : (
                "Sign In"
            )}
        </Button>
    );
}

export function LoginForm() {
    const [state, formAction] = useActionState<LoginState, FormData>(loginAction, undefined);
    const [forgotOpen, setForgotOpen] = useState(false);

    return (
        <form action={formAction} className="flex w-full flex-col gap-5" noValidate>
            {state?.error ? (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>{state.error}</span>
                </div>
            ) : null}

            <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@loymaxproperties.co.ke"
                    required
                    className="h-11"
                />
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                        type="button"
                        onClick={() => setForgotOpen(true)}
                        className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                        Forgot password?
                    </button>
                </div>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="h-11"
                />
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox name="rememberMe" />
                Remember me
            </label>

            <SubmitButton />

            <p className="text-center text-xs text-muted-foreground">
                Trouble signing in?{" "}
                <Link href="/contact" className="font-medium text-foreground underline-offset-4 hover:underline">
                    Contact your administrator
                </Link>
                .
            </p>

            <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} />
        </form>
    );
}
