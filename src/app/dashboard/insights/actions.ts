"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { verifyRole } from "@/lib/auth/dal";
import {
    createArticle,
    deleteArticle,
    deleteArticleImage,
    getArticleById,
    setArticleFeatured,
    setArticlePublished,
    updateArticle,
    uploadArticleImage,
    type ArticleInput,
} from "@/lib/firebase/articles";
import { articleSchema, type ArticleFormValues } from "@/lib/validation/article";

function revalidatePublicRoutes(slugs: (string | undefined)[]) {
    revalidatePath("/");
    revalidatePath("/insights");
    for (const slug of slugs) {
        if (slug) revalidatePath(`/insights/${slug}`);
    }
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/insights");
}

function toArticleInput(values: ArticleFormValues): ArticleInput {
    const body = values.body
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    return {
        title: values.title,
        slug: values.slug,
        category: values.category,
        excerpt: values.excerpt,
        image: values.image,
        featured: values.featured,
        published: values.published,
        body,
    };
}

export async function createArticleAction(draftId: string, values: ArticleFormValues) {
    await verifyRole("admin");
    const parsed = articleSchema.parse(values);
    const article = await createArticle(draftId, toArticleInput(parsed));
    revalidatePublicRoutes([article.slug]);
    redirect(`/dashboard/insights/${article.id}/edit`);
}

export async function updateArticleAction(id: string, values: ArticleFormValues) {
    await verifyRole("admin");
    const existing = await getArticleById(id);
    const parsed = articleSchema.parse(values);
    const article = await updateArticle(id, toArticleInput(parsed));
    revalidatePublicRoutes([existing?.slug, article.slug]);
    redirect(`/dashboard/insights/${article.id}/edit`);
}

export async function togglePublishedAction(id: string, published: boolean) {
    await verifyRole("admin");
    const article = await getArticleById(id);
    await setArticlePublished(id, published);
    revalidatePublicRoutes([article?.slug]);
}

export async function toggleFeaturedAction(id: string, featured: boolean) {
    await verifyRole("admin");
    const article = await getArticleById(id);
    await setArticleFeatured(id, featured);
    revalidatePublicRoutes([article?.slug]);
}

export async function deleteArticleAction(id: string) {
    await verifyRole("admin");
    const article = await getArticleById(id);
    await deleteArticle(id);
    revalidatePublicRoutes([article?.slug]);
}

export async function uploadArticleImageAction(articleId: string, formData: FormData): Promise<{ url: string }> {
    await verifyRole("admin");
    const file = formData.get("file");
    if (!(file instanceof File)) {
        throw new Error("No file provided.");
    }
    const url = await uploadArticleImage(articleId, file);
    return { url };
}

export async function deleteArticleImageAction(url: string): Promise<void> {
    await verifyRole("admin");
    await deleteArticleImage(url);
}
