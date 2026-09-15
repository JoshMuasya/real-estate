"use client";

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { propertyTypes } from "@/lib/data/properties";
import type { PropertyFormValues } from "@/lib/validation/property";
import { FormRow, SectionCard } from "./FormRow";

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
        control,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<PropertyFormValues>();

    const [slugTouched, setSlugTouched] = useState(mode === "edit");
    const title = watch("title");

    useEffect(() => {
        if (!slugTouched) {
            setValue("slug", slugify(title || ""), { shouldValidate: false });
        }
    }, [title, slugTouched, setValue]);

    return (
        <SectionCard title="Basic Information" description="What the listing is called and how it's described.">
            <FormRow label="Title" htmlFor="title" error={errors.title?.message}>
                <Input id="title" {...register("title")} placeholder="e.g. Karen Ridge Residence" />
            </FormRow>

            <FormRow label="Slug" htmlFor="slug" error={errors.slug?.message}>
                <Input
                    id="slug"
                    {...register("slug")}
                    onChange={(event) => {
                        setSlugTouched(true);
                        setValue("slug", event.target.value, { shouldValidate: true });
                    }}
                    placeholder="karen-ridge-residence"
                />
            </FormRow>

            <FormRow label="Description" htmlFor="description" error={errors.description?.message}>
                <Textarea id="description" rows={5} {...register("description")} />
            </FormRow>

            <div className="grid gap-5 sm:grid-cols-2">
                <FormRow label="Property Type" error={errors.propertyType?.message}>
                    <Controller
                        control={control}
                        name="propertyType"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {propertyTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormRow>

                <FormRow label="Transaction Type" error={errors.transactionType?.message}>
                    <Controller
                        control={control}
                        name="transactionType"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select transaction" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sale">For Sale</SelectItem>
                                    <SelectItem value="rent">For Rent</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormRow>
            </div>
        </SectionCard>
    );
}
