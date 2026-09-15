import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { verifyRole } from "@/lib/auth/dal";
import { getLocationById } from "@/lib/firebase/locations";
import { LocationForm } from "@/components/dashboard/location-form/LocationForm";
import type { LocationFormValues } from "@/lib/validation/location";

export const metadata: Metadata = {
    title: "Edit Location",
    description: "Update an existing featured location.",
};

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
    await verifyRole("admin");
    const { id } = await params;
    const location = await getLocationById(id);
    if (!location) notFound();

    const defaultValues: Partial<LocationFormValues> = {
        name: location.name,
        slug: location.slug,
        description: location.description,
        image: location.image,
        published: location.published,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-foreground">Edit Location</h1>
                <p className="mt-1 text-sm text-muted-foreground">{location.name}</p>
            </div>
            <LocationForm mode="edit" locationId={location.id} defaultValues={defaultValues} />
        </div>
    );
}
