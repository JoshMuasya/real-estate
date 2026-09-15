import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Car, ExternalLink, Maximize } from "lucide-react";

import { verifyRole } from "@/lib/auth/dal";
import { getPropertyById } from "@/lib/firebase/properties";
import { formatPrice } from "@/lib/data/properties";
import { Badge } from "@/components/ui/badge";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { PropertyDetailActions } from "@/components/dashboard/PropertyDetailActions";

export const metadata: Metadata = {
    title: "Property Details",
    description: "View property details, media and status.",
};

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    await verifyRole("admin", "agent");
    const { id } = await params;
    const property = await getPropertyById(id);
    if (!property) notFound();

    const specs = [
        { icon: BedDouble, label: "Bedrooms", value: property.bedrooms },
        { icon: Bath, label: "Bathrooms", value: property.bathrooms },
        { icon: Car, label: "Parking", value: property.parking },
        { icon: Maximize, label: "Built area", value: property.area ? `${property.area} m²` : "—" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{property.status}</Badge>
                        <Badge variant={property.published ? "default" : "secondary"}>
                            {property.published ? "Published" : "Draft"}
                        </Badge>
                    </div>
                    <h1 className="mt-3 font-serif text-3xl text-foreground">{property.title}</h1>
                    <p className="mt-1 text-muted-foreground">
                        {property.location} · {property.propertyType} · {formatPrice(property)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Last updated {new Date(property.updatedAt).toLocaleString("en-KE")}
                    </p>
                </div>
                <a
                    href={`/properties/${property.slug}?preview=1`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-dash-active hover:underline"
                >
                    Preview on public site
                    <ExternalLink className="size-3.5" />
                </a>
            </div>

            <PropertyDetailActions property={property} />

            {property.images.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                    <PropertyGallery images={property.images} title={property.title} />
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                <div className="space-y-6">
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {specs.map((spec) => (
                                <div key={spec.label}>
                                    <spec.icon className="size-4 text-dash-active" />
                                    <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                                        {spec.label}
                                    </p>
                                    <p className="font-serif text-xl text-foreground">{spec.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <h2 className="font-serif text-lg text-foreground">Description</h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{property.description}</p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-xl border border-border bg-card p-6">
                            <h3 className="text-sm font-medium text-foreground">Features</h3>
                            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                                {property.features.map((feature) => (
                                    <li key={feature}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-6">
                            <h3 className="text-sm font-medium text-foreground">Amenities</h3>
                            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                                {property.amenities.map((amenity) => (
                                    <li key={amenity}>{amenity}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <aside className="h-fit rounded-xl border border-border bg-card p-6">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Listing Agent</p>
                    <p className="mt-2 font-serif text-lg text-foreground">{property.agent.name}</p>
                    <p className="text-sm text-muted-foreground">{property.agent.title}</p>
                    <div className="mt-4 space-y-1 text-sm">
                        <p>{property.agent.phone}</p>
                        <p>{property.agent.email}</p>
                    </div>
                    <Link
                        href={`/dashboard/properties/${property.id}/edit`}
                        className="mt-6 block text-center text-sm font-medium text-dash-active hover:underline"
                    >
                        Edit listing details
                    </Link>
                </aside>
            </div>
        </div>
    );
}
