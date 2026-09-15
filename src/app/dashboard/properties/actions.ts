"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { verifyRole } from "@/lib/auth/dal";
import {
    createProperty,
    deleteProperty,
    deletePropertyImage,
    duplicateProperty,
    getPropertyById,
    setFeatured,
    setPublished,
    updateProperty,
    uploadPropertyImage,
    type PropertyInput,
} from "@/lib/firebase/properties";
import { propertySchema, type PropertyFormValues } from "@/lib/validation/property";

function revalidatePublicRoutes(slugs: (string | undefined)[]) {
    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath("/buy");
    revalidatePath("/rent");
    revalidatePath("/developments");
    for (const slug of slugs) {
        if (slug) revalidatePath(`/properties/${slug}`);
    }
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/properties");
}

function toPropertyInput(values: PropertyFormValues): PropertyInput {
    return {
        title: values.title,
        slug: values.slug,
        location: values.location,
        propertyType: values.propertyType,
        transactionType: values.transactionType,
        price: values.price,
        currency: values.currency,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        parking: values.parking,
        area: values.area,
        landSize: values.landSize,
        description: values.description,
        features: values.features,
        amenities: values.amenities,
        images: values.images,
        status: values.status,
        featured: values.featured,
        published: values.published,
        agent: values.agent,
    };
}

export async function createPropertyAction(draftId: string, values: PropertyFormValues) {
    await verifyRole("admin", "agent");
    const parsed = propertySchema.parse(values);
    const property = await createProperty(draftId, toPropertyInput(parsed));
    revalidatePublicRoutes([property.slug]);
    redirect(`/dashboard/properties/${property.id}`);
}

export async function updatePropertyAction(id: string, values: PropertyFormValues) {
    await verifyRole("admin", "agent");
    const existing = await getPropertyById(id);
    const parsed = propertySchema.parse(values);
    const property = await updateProperty(id, toPropertyInput(parsed));
    revalidatePublicRoutes([existing?.slug, property.slug]);
    redirect(`/dashboard/properties/${property.id}`);
}

export async function togglePublishedAction(id: string, published: boolean) {
    await verifyRole("admin", "agent");
    const property = await getPropertyById(id);
    await setPublished([id], published);
    revalidatePublicRoutes([property?.slug]);
}

export async function toggleFeaturedAction(id: string, featured: boolean) {
    await verifyRole("admin", "agent");
    const property = await getPropertyById(id);
    await setFeatured(id, featured);
    revalidatePublicRoutes([property?.slug]);
}

export async function bulkSetPublishedAction(ids: string[], published: boolean) {
    await verifyRole("admin", "agent");
    await setPublished(ids, published);
    revalidatePublicRoutes([]);
}

export async function duplicatePropertyAction(id: string) {
    await verifyRole("admin", "agent");
    const copy = await duplicateProperty(id);
    revalidatePath("/dashboard/properties");
    redirect(`/dashboard/properties/${copy.id}/edit`);
}

export async function deletePropertyAction(id: string) {
    await verifyRole("admin", "agent");
    const property = await getPropertyById(id);
    await deleteProperty(id);
    revalidatePublicRoutes([property?.slug]);
}

export async function uploadImageAction(propertyId: string, formData: FormData): Promise<{ url: string }> {
    await verifyRole("admin", "agent");
    const file = formData.get("file");
    if (!(file instanceof File)) {
        throw new Error("No file provided.");
    }
    const url = await uploadPropertyImage(propertyId, file);
    return { url };
}

export async function deleteImageAction(url: string): Promise<void> {
    await verifyRole("admin", "agent");
    await deletePropertyImage(url);
}
