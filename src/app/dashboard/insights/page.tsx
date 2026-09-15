import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { verifyRole } from "@/lib/auth/dal";
import { getAllArticles, type ArticleListFilters } from "@/lib/firebase/articles";
import { ArticleTable } from "@/components/dashboard/ArticleTable";
import { ArticleTableToolbar } from "@/components/dashboard/ArticleTableToolbar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Articles",
    description: "Manage insights and journal articles.",
};

const PAGE_SIZE = 12;

interface PageProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
        published?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function InsightsPage({ searchParams }: PageProps) {
    await verifyRole("admin");
    const params = await searchParams;
    const page = Math.max(1, Number(params.page) || 1);

    const filters: ArticleListFilters = {
        search: params.q,
        category: params.category,
        published: params.published === "true" ? true : params.published === "false" ? false : undefined,
        sort: (params.sort as ArticleListFilters["sort"]) || "newest",
        page,
        pageSize: PAGE_SIZE,
    };

    const { items, total } = await getAllArticles(filters);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    function pageHref(target: number) {
        const search = new URLSearchParams(
            Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][],
        );
        search.set("page", String(target));
        return `/dashboard/insights?${search.toString()}`;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl text-foreground">All Articles</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {total} article{total === 1 ? "" : "s"} in the journal
                    </p>
                </div>
            </div>

            <ArticleTableToolbar />
            <ArticleTable items={items} />

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        {page <= 1 ? (
                            <Button variant="outline" size="sm" disabled>
                                <ChevronLeft className="size-4" />
                                Previous
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" render={<Link href={pageHref(page - 1)} />}>
                                <ChevronLeft className="size-4" />
                                Previous
                            </Button>
                        )}
                        {page >= totalPages ? (
                            <Button variant="outline" size="sm" disabled>
                                Next
                                <ChevronRight className="size-4" />
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" render={<Link href={pageHref(page + 1)} />}>
                                Next
                                <ChevronRight className="size-4" />
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
