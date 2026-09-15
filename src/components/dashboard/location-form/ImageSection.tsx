"use client";

import { Controller, useFormContext } from "react-hook-form";

import { deleteLocationImageAction, uploadLocationImageAction } from "@/app/dashboard/locations/actions";
import { HeroImageSection } from "@/components/dashboard/HeroImageSection";
import type { LocationFormValues } from "@/lib/validation/location";

export function ImageSection({ locationId }: { locationId: string }) {
    const { control } = useFormContext<LocationFormValues>();

    return (
        <Controller
            control={control}
            name="image"
            render={({ field, fieldState }) => (
                <HeroImageSection
                    title="Image"
                    description="Shown on the homepage's featured locations grid."
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                    entityId={locationId}
                    uploadAction={uploadLocationImageAction}
                    deleteAction={deleteLocationImageAction}
                />
            )}
        />
    );
}
