"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { createArticleAction, updateArticleAction } from "@/app/dashboard/insights/actions";
import { Button } from "@/components/ui/button";
import { isNextRedirectError } from "@/lib/utils";
import { articleFormDefaults, articleSchema, type ArticleFormValues } from "@/lib/validation/article";
import { BasicInfoSection } from "./BasicInfoSection";
import { ImageSection } from "./ImageSection";
import { PublishingSection } from "./PublishingSection";

interface ArticleFormProps {
    mode: "create" | "edit";
    articleId: string;
    defaultValues?: Partial<ArticleFormValues>;
}

export function ArticleForm({ mode, articleId, defaultValues }: ArticleFormProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<ArticleFormValues>({
        // zod's .default() fields make the resolver's inferred input type
        // differ from its output type; the default is applied at runtime, so
        // the resolver is asserted to operate on the (post-default) form shape.
        resolver: zodResolver(articleSchema) as Resolver<ArticleFormValues>,
        defaultValues: { ...articleFormDefaults, ...defaultValues },
    });

    const {
        formState: { isDirty },
    } = form;

    useEffect(() => {
        function handler(event: BeforeUnloadEvent) {
            if (isDirty) {
                event.preventDefault();
            }
        }
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    async function onSubmit(values: ArticleFormValues) {
        setSubmitting(true);
        try {
            if (mode === "create") {
                await createArticleAction(articleId, values);
            } else {
                await updateArticleAction(articleId, values);
            }
        } catch (error) {
            if (isNextRedirectError(error)) throw error;
            toast.error("Something went wrong while saving. Please try again.");
            setSubmitting(false);
        }
    }

    function handleCancel() {
        if (isDirty && !window.confirm("Discard unsaved changes?")) return;
        router.push("/dashboard/insights");
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-24">
                <BasicInfoSection mode={mode} />
                <ImageSection articleId={articleId} />
                <PublishingSection />

                <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-border bg-background/95 px-4 py-4 backdrop-blur lg:-mx-8 lg:px-8">
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                        {mode === "create" ? "Create Article" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
