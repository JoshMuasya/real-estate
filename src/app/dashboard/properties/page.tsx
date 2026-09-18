import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { verifyRole } from "@/lib/auth/dal";
import { getAllProperties, type PropertyListFilters } from "@/lib/firebase/properties";
import type { PropertyStatus } from "@/lib/types";
import { PropertyTable } from "@/components/dashboard/PropertyTable";
import { PropertyTableToolbar } from "@/components/dashboard/PropertyTableToolbar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Properties",
    description: "Browse, filter and manage every property listing.",
};

const PAGE_SIZE = 12;

interface PageProps {
    searchParams: Promise<{
        q?: string;
        type?: string;
        location?: string;
        status?: string;
        published?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function PropertiesPage({ searchParams }: PageProps) {
    await verifyRole("admin", "agent");
    const params = await searchParams;
    const page = Math.max(1, Number(params.page) || 1);

    const filters: PropertyListFilters = {
        search: params.q,
        propertyType: params.type,
        location: params.location,
        status: params.status as PropertyStatus | undefined,
        published: params.published === "true" ? true : params.published === "false" ? false : undefined,
        sort: (params.sort as PropertyListFilters["sort"]) || "newest",
        page,
        pageSize: PAGE_SIZE,
    };

    const { items, total } = await getAllProperties(filters);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    function pageHref(target: number) {
        const search = new URLSearchParams(
            Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][],
        );
        search.set("page", String(target));
        return `/dashboard/properties?${search.toString()}`;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl text-foreground">All Properties</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {total} propert{total === 1 ? "y" : "ies"} in the catalogue
                    </p>
                </div>
            </div>

            <PropertyTableToolbar />
            <PropertyTable items={items} />

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
                            <Button variant="outline" size="sm" nativeButton={false} render={<Link href={pageHref(page - 1)} />}>
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
                            <Button variant="outline" size="sm" nativeButton={false} render={<Link href={pageHref(page + 1)} />}>
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
