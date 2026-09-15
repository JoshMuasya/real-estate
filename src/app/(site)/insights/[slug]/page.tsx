import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate } from "@/lib/data/insights";
import { getArticleBySlug, getPublishedArticles } from "@/lib/firebase/articles";

interface ArticlePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const articles = await getPublishedArticles();
    return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
    params,
}: ArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return {
            title: "Article not found | Loymax Properties",
            robots: { index: false, follow: false },
        };
    }

    return {
        title: `${article.title} | The Loymax Journal`,
        description: article.excerpt,
        openGraph: {
            type: "article",
            title: article.title,
            description: article.excerpt,
            publishedTime: article.date,
        },
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    const allArticles = await getPublishedArticles();
    const more = allArticles.filter((a) => a.slug !== article.slug).slice(0, 2);

    return (
        <>
            <article>
                <header className="mx-auto max-w-3xl px-6 pt-40 pb-12 text-center lg:pt-48">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                        {article.category} · {formatDate(article.date)} · {article.readingTime}
                    </p>

                    <h1 className="mt-6 font-serif text-4xl leading-tight tracking-tight text-foreground md:text-6xl">
                        {article.title}
                    </h1>
                </header>

                <div className="mx-auto max-w-5xl px-6">
                    <div className="relative aspect-[3/2] w-full overflow-hidden">
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 64rem"
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="mx-auto max-w-2xl px-6 py-16 lg:py-24">
                    <p className="border-l-2 border-brand pl-6 font-serif text-2xl leading-snug text-foreground">
                        {article.excerpt}
                    </p>

                    <div className="mt-12 space-y-6">
                        {article.body.map((paragraph) => (
                            <p key={paragraph} className="text-lg leading-relaxed text-muted-foreground">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <Link
                        href="/contact"
                        className="mt-14 inline-block bg-primary px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85"
                    >
                        Speak With a Consultant
                    </Link>
                </div>
            </article>

            {more.length > 0 && (
                <section className="border-t border-border bg-background py-20">
                    <div className="mx-auto max-w-[88rem] px-6 lg:px-10">
                        <h2 className="font-serif text-3xl text-foreground">Continue reading</h2>

                        <div className="mt-10 grid gap-10 md:grid-cols-2">
                            {more.map((a) => (
                                <Link
                                    key={a.id}
                                    href={`/insights/${a.slug}`}
                                    className="group flex items-center gap-6 border-b border-border pb-6"
                                >
                                    <div className="relative h-24 w-32 shrink-0 overflow-hidden">
                                        <Image
                                            src={a.image}
                                            alt={a.title}
                                            fill
                                            sizes="128px"
                                            className="object-cover"
                                        />
                                    </div>

                                    <span>
                                        <span className="block text-xs font-medium uppercase tracking-[0.2em] text-primary">
                                            {a.category}
                                        </span>

                                        <span className="mt-2 block font-serif text-xl text-foreground transition-colors group-hover:text-primary">
                                            {a.title}
                                        </span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
