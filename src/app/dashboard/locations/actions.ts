"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { verifyRole } from "@/lib/auth/dal";
import {
    createLocation,
    deleteLocation,
    deleteLocationImage,
    setLocationPublished,
    updateLocation,
    uploadLocationImage,
    type LocationInput,
} from "@/lib/firebase/locations";
import { locationSchema, type LocationFormValues } from "@/lib/validation/location";

function revalidatePublicRoutes() {
    revalidatePath("/");
    revalidatePath("/dashboard/locations");
}

function toLocationInput(values: LocationFormValues): LocationInput {
    return {
        name: values.name,
        slug: values.slug,
        description: values.description,
        image: values.image,
        published: values.published,
    };
}

export async function createLocationAction(draftId: string, values: LocationFormValues) {
    await verifyRole("admin");
    const parsed = locationSchema.parse(values);
    const location = await createLocation(draftId, toLocationInput(parsed));
    revalidatePublicRoutes();
    redirect(`/dashboard/locations/${location.id}/edit`);
}

export async function updateLocationAction(id: string, values: LocationFormValues) {
    await verifyRole("admin");
    const parsed = locationSchema.parse(values);
    const location = await updateLocation(id, toLocationInput(parsed));
    revalidatePublicRoutes();
    redirect(`/dashboard/locations/${location.id}/edit`);
}

export async function togglePublishedAction(id: string, published: boolean) {
    await verifyRole("admin");
    await setLocationPublished(id, published);
    revalidatePublicRoutes();
}

export async function deleteLocationAction(id: string) {
    await verifyRole("admin");
    await deleteLocation(id);
    revalidatePublicRoutes();
}

export async function uploadLocationImageAction(locationId: string, formData: FormData): Promise<{ url: string }> {
    await verifyRole("admin");
    const file = formData.get("file");
    if (!(file instanceof File)) {
        throw new Error("No file provided.");
    }
    const url = await uploadLocationImage(locationId, file);
    return { url };
}

export async function deleteLocationImageAction(url: string): Promise<void> {
    await verifyRole("admin");
    await deleteLocationImage(url);
}
