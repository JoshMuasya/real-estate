import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { formatDate } from "@/lib/data/insights";
import { getPublishedArticles } from "@/lib/firebase/articles";

export default async function InsightsPage() {
    const articles = await getPublishedArticles();

    return (
        <>
            <PageHeader
                eyebrow="Insights"
                title="The Loymax Journal."
                description="Notes on the market, the process and the decisions that shape property outcomes."
            />

            <section className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 lg:py-28">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, index) => (
                        <Reveal key={article.id} delay={index * 70}>
                            <article className="flex h-full flex-col">
                                <Link
                                    href={`/insights/${article.slug}`}
                                    className="group block aspect-[3/2] overflow-hidden"
                                    aria-label={`Read ${article.title}`}
                                >
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        width={1200}
                                        height={800}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                    />
                                </Link>

                                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                                        {article.category}
                                    </span>

                                    {article.featured && (
                                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
                                            Featured
                                        </span>
                                    )}

                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(article.date)}
                                    </span>
                                </div>

                                <h2 className="mt-4 font-serif text-2xl leading-snug text-foreground">
                                    <Link
                                        href={`/insights/${article.slug}`}
                                        className="transition-colors hover:text-primary"
                                    >
                                        {article.title}
                                    </Link>
                                </h2>

                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                    {article.excerpt}
                                </p>

                                <Link
                                    href={`/insights/${article.slug}`}
                                    className="mt-auto pt-8 text-xs font-medium uppercase tracking-[0.15em] text-primary transition-colors hover:text-brand"
                                >
                                    Read Article
                                </Link>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </section>
        </>
    );
}