import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, CheckCircle2, Inbox, Plus, Sparkles, Star } from "lucide-react";

import { verifySession } from "@/lib/auth/dal";
import { getAllProperties, getPropertyKpis } from "@/lib/firebase/properties";
import { formatPrice } from "@/lib/data/properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/KpiCard";

export const metadata: Metadata = {
    title: "Overview",
    description: "A snapshot of properties, enquiries and recent activity across Loymax Properties.",
};

function greetingForHour(hour: number): string {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

export default async function DashboardOverviewPage() {
    const user = await verifySession();
    const [kpis, recent] = await Promise.all([
        getPropertyKpis(),
        getAllProperties({ sort: "newest", pageSize: 5 }),
    ]);

    const greeting = greetingForHour(new Date().getHours());
    const firstName = (user.name || user.email).split(/\s+/)[0];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl text-foreground">
                    {greeting}, {firstName}
                </h1>
                <p className="mt-1 text-muted-foreground">Here&apos;s what&apos;s happening with Loymax Properties.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <KpiCard
                    label="Total Properties"
                    value={kpis.total}
                    description="Properties in the system"
                    icon={Building2}
                />
                <KpiCard
                    label="Published"
                    value={kpis.published}
                    description="Visible on the public site"
                    icon={CheckCircle2}
                />
                <KpiCard
                    label="Featured"
                    value={kpis.featured}
                    description="Shown on the homepage"
                    icon={Star}
                    accent
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Link
                    href="/dashboard/properties/new"
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-dash-active hover:bg-dash-active/5"
                >
                    <span className="flex size-9 items-center justify-center rounded-full bg-dash-active/10 text-dash-active">
                        <Plus className="size-4" />
                    </span>
                    <span className="text-sm font-medium text-foreground">Add Property</span>
                </Link>
                <Link
                    href="/dashboard/properties"
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-dash-active hover:bg-dash-active/5"
                >
                    <span className="flex size-9 items-center justify-center rounded-full bg-dash-active/10 text-dash-active">
                        <Building2 className="size-4" />
                    </span>
                    <span className="text-sm font-medium text-foreground">View All Properties</span>
                </Link>
                <Link
                    href="/dashboard/inquiries"
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-dash-active hover:bg-dash-active/5"
                >
                    <span className="flex size-9 items-center justify-center rounded-full bg-dash-active/10 text-dash-active">
                        <Inbox className="size-4" />
                    </span>
                    <span className="text-sm font-medium text-foreground">View Enquiries</span>
                </Link>
            </div>

            <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border p-5">
                    <h2 className="font-serif text-xl text-foreground">Recent Properties</h2>
                    <Button variant="link" size="sm" nativeButton={false} render={<Link href="/dashboard/properties" />}>
                        View All Properties →
                    </Button>
                </div>

                {recent.items.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 p-12 text-center text-muted-foreground">
                        <Sparkles className="size-6" />
                        <p>No properties yet. Add your first listing to get started.</p>
                        <Button nativeButton={false} render={<Link href="/dashboard/properties/new" />}>Add Property</Button>
                    </div>
                ) : (
                    <ul className="divide-y divide-border">
                        {recent.items.map((property) => (
                            <li key={property.id}>
                                <Link
                                    href={`/dashboard/properties/${property.id}`}
                                    className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
                                >
                                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                                        {property.images[0] && (
                                            <Image
                                                src={property.images[0]}
                                                alt={property.title}
                                                fill
                                                sizes="56px"
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-foreground">{property.title}</p>
                                        <p className="truncate text-sm text-muted-foreground">{property.location}</p>
                                    </div>
                                    <div className="hidden text-sm text-muted-foreground sm:block">
                                        {formatPrice(property)}
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1.5">
                                        {property.featured && (
                                            <Star className="size-3.5 fill-dash-accent text-dash-accent" />
                                        )}
                                        <Badge variant={property.published ? "default" : "secondary"}>
                                            {property.published ? "Published" : "Draft"}
                                        </Badge>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
