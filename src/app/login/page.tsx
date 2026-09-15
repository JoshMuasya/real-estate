import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getOptionalSession } from "@/lib/auth/dal";
import { LoymaxLogo } from "@/components/brand/LoymaxLogo";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
    title: "Sign In | Loymax Properties",
    description: "Sign in to the Loymax Properties team dashboard.",
};

export default async function LoginPage() {
    const user = await getOptionalSession();
    if (user) redirect("/dashboard");

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            <div className="relative hidden lg:block">
                <Image
                    src="/hero.jpg"
                    alt="A Loymax Properties listing"
                    fill
                    priority
                    sizes="50vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
                <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
                    <LoymaxLogo />
                    <blockquote className="max-w-md font-serif text-2xl leading-snug">
                        &ldquo;Considered listings, carefully represented — the platform behind every Loymax
                        sale.&rdquo;
                    </blockquote>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center px-6 py-16 sm:px-12">
                <div className="w-full max-w-sm">
                    <div className="mb-10 flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
                        <span className="lg:hidden">
                            <LoymaxLogo textClassName="leading-[0.95] text-foreground" barClassName="bg-brand" />
                        </span>
                        <div>
                            <h1 className="font-serif text-3xl text-foreground">Welcome back</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Sign in to manage your properties and client enquiries.
                            </p>
                        </div>
                    </div>

                    <LoginForm />

                    <p className="mt-10 text-center text-xs text-muted-foreground">
                        <Link href="/" className="hover:text-foreground hover:underline">
                            ← Back to loymaxproperties.co.ke
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
