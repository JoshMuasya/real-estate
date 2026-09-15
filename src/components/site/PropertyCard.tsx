import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Maximize } from "lucide-react";

import { cn } from "@/lib/utils";
import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/data/properties";

interface StatusBadgeProps {
    status: Property["status"];
}

interface PropertyCardProps {
    property: Property;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const isAccent = status === "New" || status === "Reserved";

    return (
        <span
            className={cn(
                "inline-block px-3 py-1.5 text-xs font-medium uppercase tracking-[0.15em] backdrop-blur-sm",
                isAccent
                    ? "bg-brand text-brand-foreground"
                    : "bg-background/90 text-foreground",
            )}
        >
            {status}
        </span>
    );
}

export function PropertyCard({ property }: PropertyCardProps) {
    const propertyHref = `/properties/${property.slug}`;

    return (
        <article className="group flex h-full flex-col bg-background">
            <Link
                href={propertyHref}
                className="relative block aspect-[4/3] overflow-hidden"
                aria-label={`View ${property.title}`}
            >
                <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute left-4 top-4 flex gap-2">
                    <StatusBadge status={property.status} />

                    {property.featured && (
                        <span className="inline-block bg-primary/95 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground backdrop-blur-sm">
                            Featured
                        </span>
                    )}
                </div>
            </Link>

            <div className="flex flex-1 flex-col border-x border-b border-border p-6">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                    {property.location} · {property.propertyType}
                </p>

                <h3 className="mt-3 font-serif text-2xl text-foreground">
                    <Link
                        href={propertyHref}
                        className="transition-colors hover:text-primary"
                    >
                        {property.title}
                    </Link>
                </h3>

                <dl className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    {property.bedrooms > 0 && (
                        <div className="flex items-center gap-2">
                            <BedDouble
                                className="h-4 w-4 text-primary"
                                strokeWidth={1.4}
                                aria-hidden="true"
                            />

                            <dt className="sr-only">Bedrooms</dt>
                            <dd>{property.bedrooms} bed</dd>
                        </div>
                    )}

                    {property.bathrooms > 0 && (
                        <div className="flex items-center gap-2">
                            <Bath
                                className="h-4 w-4 text-primary"
                                strokeWidth={1.4}
                                aria-hidden="true"
                            />

                            <dt className="sr-only">Bathrooms</dt>
                            <dd>{property.bathrooms} bath</dd>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <Maximize
                            className="h-4 w-4 text-primary"
                            strokeWidth={1.4}
                            aria-hidden="true"
                        />

                        <dt className="sr-only">Area</dt>

                        <dd>
                            {property.area > 0
                                ? `${property.area} m²`
                                : `${property.landSize ?? 0} m² land`}
                        </dd>
                    </div>
                </dl>

                <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                    <p className="font-serif text-xl text-primary">
                        {formatPrice(property)}
                    </p>

                    <Link
                        href={propertyHref}
                        className="border-b border-primary/40 pb-1 text-xs font-medium uppercase tracking-[0.15em] text-primary transition-colors hover:border-brand hover:text-brand"
                    >
                        View Property
                    </Link>
                </div>
            </div>
        </article>
    );
}