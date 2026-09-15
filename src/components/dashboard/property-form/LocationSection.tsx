"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { locations } from "@/lib/data/properties";
import type { PropertyFormValues } from "@/lib/validation/property";
import { FormRow, SectionCard } from "./FormRow";

export function LocationSection() {
    const {
        control,
        formState: { errors },
    } = useFormContext<PropertyFormValues>();

    return (
        <SectionCard title="Location" description="Where the property is, as shown to buyers and tenants.">
            <FormRow label="Location" error={errors.location?.message}>
                <Controller
                    control={control}
                    name="location"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full sm:w-64">
                                <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                                {locations.map((location) => (
                                    <SelectItem key={location} value={location}>
                                        {location}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </FormRow>
        </SectionCard>
    );
}
