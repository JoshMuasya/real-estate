"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { PropertyFormValues } from "@/lib/validation/property";
import { FormRow, SectionCard } from "./FormRow";

export function DetailsSection() {
    const {
        register,
        formState: { errors },
    } = useFormContext<PropertyFormValues>();

    return (
        <SectionCard title="Property Details" description="Size and configuration.">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <FormRow label="Bedrooms" htmlFor="bedrooms" error={errors.bedrooms?.message}>
                    <Input id="bedrooms" type="number" min={0} {...register("bedrooms")} />
                </FormRow>
                <FormRow label="Bathrooms" htmlFor="bathrooms" error={errors.bathrooms?.message}>
                    <Input id="bathrooms" type="number" min={0} {...register("bathrooms")} />
                </FormRow>
                <FormRow label="Parking" htmlFor="parking" error={errors.parking?.message}>
                    <Input id="parking" type="number" min={0} {...register("parking")} />
                </FormRow>
                <FormRow label="Built Area (m²)" htmlFor="area" error={errors.area?.message}>
                    <Input id="area" type="number" min={0} {...register("area")} />
                </FormRow>
                <FormRow label="Land Size (m²)" htmlFor="landSize" error={errors.landSize?.message} optional>
                    <Input id="landSize" type="number" min={0} {...register("landSize")} />
                </FormRow>
            </div>
        </SectionCard>
    );
}
