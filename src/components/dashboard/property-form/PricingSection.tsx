"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { PropertyFormValues } from "@/lib/validation/property";
import { FormRow, SectionCard } from "./FormRow";

export function PricingSection() {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext<PropertyFormValues>();

    const transactionType = watch("transactionType");

    return (
        <SectionCard title="Pricing" description="Listing price shown on the public site.">
            <div className="grid gap-5 sm:grid-cols-2">
                <FormRow label="Price" htmlFor="price" error={errors.price?.message}>
                    <Input id="price" type="number" min={0} {...register("price")} />
                </FormRow>
                <FormRow label="Currency" htmlFor="currency" error={errors.currency?.message}>
                    <Input id="currency" {...register("currency")} placeholder="KES" />
                </FormRow>
            </div>
            {transactionType === "rent" && (
                <p className="text-xs text-muted-foreground">Rental prices are shown as &quot;/ month&quot; on the public site.</p>
            )}
        </SectionCard>
    );
}
