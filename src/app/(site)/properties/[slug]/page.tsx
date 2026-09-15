import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Car, MapPin, Maximize, Ruler } from "lucide-react";

import { formatPrice } from "@/lib/data/properties";
import {
    getPropertyBySlug,
    getPropertyBySlugUnfiltered,
    getSimilarPublishedProperties,
    getStaticPropertySlugs,
} from "@/lib/firebase/properties";
import { getOptionalSession } from "@/lib/auth/dal";
import { LeadForm } from "@/components/site/LeadForm";
import { PropertyCard, StatusBadge } from "@/components/site/PropertyCard";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { Reveal } from "@/components/site/Reveal";

interface PropertyPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ preview?: string }>;
}

export async function generateStaticParams() {
    const slugs = await getStaticPropertySlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: PropertyPageProps): Promise<Metadata> {
    const { slug } = await params;
    const property = await getPropertyBySlug(slug);

    if (!property) {
        return {
            title: "Property not found | Loymax Properties",
            robots: { index: false, follow: false },
        };
    }

    const description = property.description.slice(0, 150);

    return {
        title: `${property.title}, ${property.location} | Loymax Properties`,
        description,
        openGraph: {
            title: `${property.title}, ${property.location}`,
            description,
        },
    };
}

export default async function PropertyPage({ params, searchParams }: PropertyPageProps) {
    const { slug } = await params;
    const { preview } = await searchParams;

    let property = await getPropertyBySlug(slug);
    let isPreview = false;

    if (!property && preview === "1") {
        const user = await getOptionalSession();
        if (user) {
            property = await getPropertyBySlugUnfiltered(slug);
            isPreview = Boolean(property);
        }
    }

    if (!property) {
        notFound();
    }

    const specs = [
        { icon: BedDouble, label: "Bedrooms", value: property.bedrooms || "—" },
        { icon: Bath, label: "Bathrooms", value: property.bathrooms || "—" },
        { icon: Car, label: "Parking", value: property.parking || "—" },
        { icon: Maximize, label: "Built area", value: property.area ? `${property.area} m²` : "—" },
        {
            icon: Ruler,
            label: "Land size",
            value: property.landSize ? `${property.landSize.toLocaleString()} m²` : "—",
        },
    ];

    const similar = await getSimilarPublishedProperties(property, 2);

    return (
        <>
            {isPreview && (
                <div className="sticky top-0 z-40 bg-dash-accent px-6 py-2.5 text-center text-xs font-medium uppercase tracking-[0.15em] text-dash-accent-foreground">
                    Preview mode — this property is unpublished and not visible to the public
                </div>
            )}

            <section className="bg-background pt-32 lg:pt-36">
                <div className="mx-auto max-w-[88rem] px-6 lg:px-10">
                    <nav aria-label="Breadcrumb" className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        <Link href="/properties" className="transition-colors hover:text-primary">
                            Properties
                        </Link>
                        <span className="mx-3 text-brand">/</span>
                        <span className="text-foreground">{property.location}</span>
                    </nav>

                    <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <StatusBadge status={property.status} />
                                <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                    {property.propertyType}
                                </span>
                            </div>

                            <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight tracking-tight text-foreground md:text-6xl">
                                {property.title}
                            </h1>

                            <p className="mt-4 flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary" strokeWidth={1.4} aria-hidden="true" />
                                {property.location}, Kenya
                            </p>
                        </div>

                        <p className="font-serif text-3xl text-primary md:text-4xl">
                            {formatPrice(property)}
                        </p>
                    </div>

                    <PropertyGallery images={property.images} title={property.title} />
                </div>
            </section>

            <section className="mx-auto grid max-w-[88rem] gap-16 px-6 py-20 lg:grid-cols-[1.6fr_1fr] lg:px-10 lg:py-28">
                <div>
                    <dl className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-5">
                        {specs.map((s) => (
                            <div key={s.label} className="bg-background p-6">
                                <s.icon className="h-5 w-5 text-primary" strokeWidth={1.3} aria-hidden="true" />
                                <dt className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                                    {s.label}
                                </dt>
                                <dd className="mt-1 font-serif text-2xl text-foreground">{s.value}</dd>
                            </div>
                        ))}
                    </dl>

                    <Reveal className="mt-16">
                        <h2 className="font-serif text-3xl text-foreground">About this property</h2>
                        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                            {property.description}
                        </p>
                    </Reveal>

                    <div className="mt-16 grid gap-12 sm:grid-cols-2">
                        <Reveal>
                            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                                Features
                            </h3>
                            <ul className="mt-6 space-y-3">
                                {property.features.map((f) => (
                                    <li
                                        key={f}
                                        className="flex gap-3 border-b border-border pb-3 text-sm text-foreground"
                                    >
                                        <span className="mt-2 h-px w-4 shrink-0 bg-brand" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </Reveal>

                        <Reveal delay={80}>
                            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                                Amenities
                            </h3>
                            <ul className="mt-6 space-y-3">
                                {property.amenities.map((a) => (
                                    <li
                                        key={a}
                                        className="flex gap-3 border-b border-border pb-3 text-sm text-foreground"
                                    >
                                        <span className="mt-2 h-px w-4 shrink-0 bg-brand" />
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                    </div>

                    <Reveal className="mt-16">
                        <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                            Location
                        </h3>
                        <div className="mt-6 flex h-64 items-center justify-center border border-border bg-muted/60">
                            <p className="flex items-center gap-3 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary" strokeWidth={1.4} aria-hidden="true" />
                                {property.location}, Kenya — exact address shared on viewing
                            </p>
                        </div>
                    </Reveal>
                </div>

                <aside className="lg:sticky lg:top-28 lg:self-start">
                    <div className="border border-border bg-background p-8">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            Your consultant
                        </p>
                        <p className="mt-3 font-serif text-2xl text-foreground">{property.agent.name}</p>
                        <p className="text-sm text-muted-foreground">{property.agent.title}</p>

                        <div className="mt-6 space-y-2 text-sm">
                            <a href={`tel:${property.agent.phone}`} className="block text-primary hover:text-brand">
                                {property.agent.phone}
                            </a>
                            <a href={`mailto:${property.agent.email}`} className="block text-primary hover:text-brand">
                                {property.agent.email}
                            </a>
                        </div>

                        <a
                            href="#enquire"
                            className="mt-8 block bg-primary px-6 py-4 text-center text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85"
                        >
                            Schedule a Private Viewing
                        </a>
                        <a
                            href="#enquire"
                            className="mt-3 block border border-border px-6 py-4 text-center text-xs font-medium uppercase tracking-[0.15em] text-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                            Request Property Information
                        </a>
                    </div>
                </aside>
            </section>

            <section id="enquire" className="border-t border-border bg-background py-20 lg:py-28">
                <div className="mx-auto grid max-w-[88rem] gap-12 px-6 lg:grid-cols-2 lg:px-10">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Enquire</p>
                        <h2 className="mt-5 font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
                            Arrange a private viewing.
                        </h2>
                        <p className="mt-6 max-w-md text-muted-foreground">
                            Viewings are arranged by appointment, at a time that suits you. Share a few
                            details and your consultant will confirm availability.
                        </p>
                    </div>

                    <LeadForm
                        type="viewing"
                        subject={property.title}
                        propertyId={property.id}
                        propertySlug={property.slug}
                    />
                </div>
            </section>

            {similar.length > 0 && (
                <section className="border-t border-border bg-muted/40 py-20 lg:py-28">
                    <div className="mx-auto max-w-[88rem] px-6 lg:px-10">
                        <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                            Also in {property.location}
                        </h2>

                        <div className="mt-12 grid gap-8 sm:grid-cols-2">
                            {similar.map((p) => (
                                <PropertyCard key={p.id} property={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
