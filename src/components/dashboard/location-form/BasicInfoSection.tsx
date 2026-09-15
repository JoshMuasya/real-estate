"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LocationFormValues } from "@/lib/validation/location";
import { FormRow, SectionCard } from "@/components/dashboard/property-form/FormRow";

function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-+|-+$)/g, "");
}

export function BasicInfoSection({ mode }: { mode: "create" | "edit" }) {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<LocationFormValues>();

    const [slugTouched, setSlugTouched] = useState(mode === "edit");
    const name = watch("name");

    useEffect(() => {
        if (!slugTouched) {
            setValue("slug", slugify(name || ""), { shouldValidate: false });
        }
    }, [name, slugTouched, setValue]);

    return (
        <SectionCard title="Basic Information" description="What the location is called and how it's described.">
            <FormRow label="Name" htmlFor="name" error={errors.name?.message}>
                <Input id="name" {...register("name")} placeholder="e.g. Nairobi" />
            </FormRow>

            <FormRow label="Slug" htmlFor="slug" error={errors.slug?.message}>
                <Input
                    id="slug"
                    {...register("slug")}
                    onChange={(event) => {
                        setSlugTouched(true);
                        setValue("slug", event.target.value, { shouldValidate: true });
                    }}
                    placeholder="nairobi"
                />
            </FormRow>

            <FormRow label="Description" htmlFor="description" error={errors.description?.message}>
                <Textarea id="description" rows={4} {...register("description")} />
            </FormRow>
        </SectionCard>
    );
}
