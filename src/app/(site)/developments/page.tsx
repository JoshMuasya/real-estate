import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/site/PageHeader";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Reveal } from "@/components/site/Reveal";
import { getPublishedProperties } from "@/lib/firebase/properties";
import { investmentCriteria } from "@/lib/data/site";


export const metadata: Metadata = {
    title: "Developments & Investment Opportunities | Loymax Properties",
    description:
        "Development sites and investment opportunities assessed on location, demand, growth potential, rental potential, quality and long-term value.",
    openGraph: {
        title: "Developments & Investment | Loymax Properties",
        description:
            "Property with purpose — opportunities evaluated on fundamentals, not hype.",
    },
};

export default async function DevelopmentsPage() {
    const publishedProperties = await getPublishedProperties();
    const opportunities = publishedProperties.filter(
        (property) =>
            property.propertyType === "Land" ||
            property.propertyType === "Commercial" ||
            property.propertyType === "Townhouse",
    );

    return (
        <>
            <PageHeader
                eyebrow="Developments"
                title="Property With Purpose."
                description="We help investors and developers evaluate opportunities on fundamentals — and we do not publish performance projections we cannot stand behind."
            />

            <section className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 lg:py-28">
                {/* Investment Criteria */}
                <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {investmentCriteria.map((criterion, index) => (
                        <Reveal
                            key={criterion}
                            delay={index * 50}
                            className="bg-background p-10"
                        >
                            <p className="font-serif text-3xl text-primary">
                                {String(index + 1).padStart(2, "0")}
                            </p>

                            <h2 className="mt-6 font-serif text-2xl text-foreground">
                                {criterion}
                            </h2>
                        </Reveal>
                    ))}
                </div>

                {/* Current Opportunities */}
                <div className="mt-24">
                    <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl">
                        Current opportunities.
                    </h2>

                    {opportunities.length > 0 ? (
                        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {opportunities.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="mt-12 text-muted-foreground">
                            No current development opportunities are available.
                        </p>
                    )}

                    <div className="mt-14">
                        <Link
                            href="/contact"
                            className="inline-block bg-primary px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85"
                        >
                            Explore Investment Opportunities
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}