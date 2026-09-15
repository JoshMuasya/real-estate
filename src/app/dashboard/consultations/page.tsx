import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { verifyRole } from "@/lib/auth/dal";
import { getLeads, type LeadListFilters } from "@/lib/firebase/leads";
import type { LeadStatus } from "@/lib/types";
import { LeadTable } from "@/components/dashboard/leads/LeadTable";
import { LeadTableToolbar } from "@/components/dashboard/leads/LeadTableToolbar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Consultations",
    description: "Manage client consultation requests.",
};

const PAGE_SIZE = 20;
const BASE_PATH = "/dashboard/consultations";

interface PageProps {
    searchParams: Promise<{ q?: string; status?: string; sort?: string; page?: string }>;
}

export default async function ConsultationsPage({ searchParams }: PageProps) {
    await verifyRole("admin", "agent");
    const params = await searchParams;
    const page = Math.max(1, Number(params.page) || 1);

    const filters: LeadListFilters = {
        category: "consultation",
        search: params.q,
        status: params.status as LeadStatus | undefined,
        sort: (params.sort as LeadListFilters["sort"]) || "newest",
        page,
        pageSize: PAGE_SIZE,
    };

    const { items, total } = await getLeads(filters);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    function pageHref(target: number) {
        const search = new URLSearchParams(
            Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][],
        );
        search.set("page", String(target));
        return `${BASE_PATH}?${search.toString()}`;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-foreground">Consultations</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {total} consultation, sell, or valuation request{total === 1 ? "" : "s"}
                </p>
            </div>

            <LeadTableToolbar />
            <LeadTable items={items} emptyMessage="No consultation requests match these filters." />

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
