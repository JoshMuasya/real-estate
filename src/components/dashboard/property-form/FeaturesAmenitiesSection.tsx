"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { TagInput } from "@/components/dashboard/TagInput";
import { amenityOptions } from "@/lib/data/properties";
import type { PropertyFormValues } from "@/lib/validation/property";
import { FormRow, SectionCard } from "./FormRow";

export function FeaturesAmenitiesSection() {
    const { control } = useFormContext<PropertyFormValues>();

    return (
        <SectionCard title="Features & Amenities" description="Highlights shown on the property page.">
            <FormRow label="Features">
                <Controller
                    control={control}
                    name="features"
                    render={({ field }) => (
                        <TagInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Type a feature and press Enter"
                        />
                    )}
                />
            </FormRow>

            <FormRow label="Amenities">
                <Controller
                    control={control}
                    name="amenities"
                    render={({ field }) => (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {amenityOptions.map((amenity) => {
                                const checked = field.value.includes(amenity);
                                return (
                                    <label key={amenity} className="flex items-center gap-2 text-sm text-foreground">
                                        <Checkbox
                                            checked={checked}
                                            onCheckedChange={(value) => {
                                                field.onChange(
                                                    value
                                                        ? [...field.value, amenity]
                                                        : field.value.filter((a) => a !== amenity),
                                                );
                                            }}
                                        />
                                        {amenity}
                                    </label>
                                );
                            })}
                        </div>
                    )}
                />
            </FormRow>
        </SectionCard>
    );
}
