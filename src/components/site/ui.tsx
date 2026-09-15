import type {
    InputHTMLAttributes,
    ReactNode,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

export const fieldClass =
    "w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary";

interface FieldProps {
    label: string;
    hint?: string;
    children: ReactNode;
    className?: string;
}

export function Field({
    label,
    hint,
    children,
    className,
}: FieldProps) {
    return (
        <label className={cn("block", className)}>
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {label}
            </span>

            {children}

            {hint && (
                <span className="mt-1.5 block text-xs text-destructive">
                    {hint}
                </span>
            )}
        </label>
    );
}

export function TextInput({
    className,
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cn(fieldClass, className)}
        />
    );
}

export function TextArea({
    className,
    ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={cn(
                fieldClass,
                "min-h-32 resize-y",
                className,
            )}
        />
    );
}

export function Select({
    className,
    ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={cn(
                fieldClass,
                "appearance-none",
                className,
            )}
        />
    );
}

interface SectionHeadingProps {
    eyebrow?: string;
    title: string;
    description?: string;
    align?: "left" | "center";
    tone?: "dark" | "light";
}

export function SectionHeading({
    eyebrow,
    title,
    description,
    align = "left",
    tone = "dark",
}: SectionHeadingProps) {
    const isLight = tone === "light";

    return (
        <div
            className={cn(
                "max-w-2xl",
                align === "center" && "mx-auto text-center",
            )}
        >
            {eyebrow && (
                <p
                    className={cn(
                        "text-xs font-medium uppercase tracking-[0.2em]",
                        isLight ? "text-brand" : "text-primary",
                    )}
                >
                    {eyebrow}
                </p>
            )}

            <h2
                className={cn(
                    "mt-4 font-serif text-4xl leading-tight tracking-tight md:text-5xl",
                    isLight ? "text-primary-foreground" : "text-foreground",
                )}
            >
                {title}
            </h2>

            {description && (
                <p
                    className={cn(
                        "mt-5 text-base leading-relaxed",
                        isLight
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground",
                    )}
                >
                    {description}
                </p>
            )}
        </div>
    );
}