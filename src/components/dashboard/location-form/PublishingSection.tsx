"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import type { LocationFormValues } from "@/lib/validation/location";
import { SectionCard } from "@/components/dashboard/property-form/FormRow";

export function PublishingSection() {
    const { control } = useFormContext<LocationFormValues>();

    return (
        <SectionCard title="Publishing" description="Controls visibility on the public site.">
            <Controller
                control={control}
                name="published"
                render={({ field }) => (
                    <label className="flex items-center justify-between gap-3 text-sm">
                        <span>
                            <span className="block font-medium text-foreground">Published</span>
                            <span className="text-xs text-muted-foreground">Visible on the public site</span>
                        </span>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </label>
                )}
            />
        </SectionCard>
    );
}
