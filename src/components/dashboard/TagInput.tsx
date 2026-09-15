"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function TagInput({
    value,
    onChange,
    placeholder,
    className,
}: {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    className?: string;
}) {
    const [draft, setDraft] = useState("");

    function commit() {
        const trimmed = draft.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
        }
        setDraft("");
    }

    return (
        <div className={cn("flex flex-wrap gap-2 rounded-lg border border-input p-2", className)}>
            {value.map((tag) => (
                <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs text-foreground"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => onChange(value.filter((t) => t !== tag))}
                        aria-label={`Remove ${tag}`}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <X className="size-3" />
                    </button>
                </span>
            ))}
            <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                        event.preventDefault();
                        commit();
                    } else if (event.key === "Backspace" && !draft && value.length > 0) {
                        onChange(value.slice(0, -1));
                    }
                }}
                onBlur={commit}
                placeholder={placeholder}
                className="h-6 min-w-32 flex-1 border-0 p-0 shadow-none focus-visible:ring-0"
            />
        </div>
    );
}
