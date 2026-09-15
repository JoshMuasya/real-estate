import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { verifyRole } from "@/lib/auth/dal";
import { getPropertyById } from "@/lib/firebase/properties";
import { PropertyForm } from "@/components/dashboard/property-form/PropertyForm";
import type { PropertyFormValues } from "@/lib/validation/property";

export const metadata: Metadata = {
    title: "Edit Property",
    description: "Update property details and media.",
};

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    await verifyRole("admin", "agent");
    const { id } = await params;
    const property = await getPropertyById(id);
    if (!property) notFound();

    const defaultValues: Partial<PropertyFormValues> = {
        title: property.title,
        slug: property.slug,
        description: property.description,
        propertyType: property.propertyType,
        transactionType: property.transactionType,
        location: property.location,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        parking: property.parking,
        area: property.area,
        landSize: property.landSize,
        price: property.price,
        currency: property.currency,
        features: property.features,
        amenities: property.amenities,
        images: property.images,
        status: property.status,
        published: property.published,
        featured: property.featured,
        agent: property.agent,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-foreground">Edit Property</h1>
                <p className="mt-1 text-sm text-muted-foreground">{property.title}</p>
            </div>
            <PropertyForm mode="edit" propertyId={property.id} defaultValues={defaultValues} />
        </div>
    );
}
