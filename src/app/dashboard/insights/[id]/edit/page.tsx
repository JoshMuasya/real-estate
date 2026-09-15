import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { verifyRole } from "@/lib/auth/dal";
import { getArticleById } from "@/lib/firebase/articles";
import { ArticleForm } from "@/components/dashboard/article-form/ArticleForm";
import type { ArticleFormValues } from "@/lib/validation/article";

export const metadata: Metadata = {
    title: "Edit Article",
    description: "Update an existing article.",
};

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    await verifyRole("admin");
    const { id } = await params;
    const article = await getArticleById(id);
    if (!article) notFound();

    const defaultValues: Partial<ArticleFormValues> = {
        title: article.title,
        slug: article.slug,
        category: article.category,
        excerpt: article.excerpt,
        image: article.image,
        body: article.body.join("\n\n"),
        published: article.published,
        featured: article.featured,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-foreground">Edit Article</h1>
                <p className="mt-1 text-sm text-muted-foreground">{article.title}</p>
            </div>
            <ArticleForm mode="edit" articleId={article.id} defaultValues={defaultValues} />
        </div>
    );
}
