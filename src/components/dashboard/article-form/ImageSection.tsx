"use client";

import { Controller, useFormContext } from "react-hook-form";

import { deleteArticleImageAction, uploadArticleImageAction } from "@/app/dashboard/insights/actions";
import { HeroImageSection } from "@/components/dashboard/HeroImageSection";
import type { ArticleFormValues } from "@/lib/validation/article";

export function ImageSection({ articleId }: { articleId: string }) {
    const { control } = useFormContext<ArticleFormValues>();

    return (
        <Controller
            control={control}
            name="image"
            render={({ field, fieldState }) => (
                <HeroImageSection
                    title="Hero Image"
                    description="The primary image shown on the article and its listing card."
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                    entityId={articleId}
                    uploadAction={uploadArticleImageAction}
                    deleteAction={deleteArticleImageAction}
                />
            )}
        />
    );
}
