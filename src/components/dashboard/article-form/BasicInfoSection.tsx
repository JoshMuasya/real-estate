"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ArticleFormValues } from "@/lib/validation/article";
import { FormRow, SectionCard } from "@/components/dashboard/property-form/FormRow";

function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-+|-+$)/g, "");
}

export function BasicInfoSection({ mode }: { mode: "create" | "edit" }) {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<ArticleFormValues>();

    const [slugTouched, setSlugTouched] = useState(mode === "edit");
    const title = watch("title");

    useEffect(() => {
        if (!slugTouched) {
            setValue("slug", slugify(title || ""), { shouldValidate: false });
        }
    }, [title, slugTouched, setValue]);

    return (
        <SectionCard title="Basic Information" description="What the article is called and how it's described.">
            <FormRow label="Title" htmlFor="title" error={errors.title?.message}>
                <Input id="title" {...register("title")} placeholder="e.g. Buying Property in Kenya" />
            </FormRow>

            <FormRow label="Slug" htmlFor="slug" error={errors.slug?.message}>
                <Input
                    id="slug"
                    {...register("slug")}
                    onChange={(event) => {
                        setSlugTouched(true);
                        setValue("slug", event.target.value, { shouldValidate: true });
                    }}
                    placeholder="buying-property-in-kenya"
                />
            </FormRow>

            <FormRow label="Category" htmlFor="category" error={errors.category?.message}>
                <Input id="category" {...register("category")} placeholder="e.g. Buying" />
            </FormRow>

            <FormRow label="Excerpt" htmlFor="excerpt" error={errors.excerpt?.message}>
                <Textarea id="excerpt" rows={3} {...register("excerpt")} />
            </FormRow>

            <FormRow
                label="Body"
                htmlFor="body"
                error={errors.body?.message}
                className="gap-1.5"
            >
                <Textarea id="body" rows={16} {...register("body")} placeholder="Separate paragraphs with a blank line." />
            </FormRow>
        </SectionCard>
    );
}
