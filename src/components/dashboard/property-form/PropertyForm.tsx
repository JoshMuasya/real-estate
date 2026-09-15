"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { createPropertyAction, updatePropertyAction } from "@/app/dashboard/properties/actions";
import { Button } from "@/components/ui/button";
import { isNextRedirectError } from "@/lib/utils";
import { propertyFormDefaults, propertySchema, type PropertyFormValues } from "@/lib/validation/property";
import { BasicInfoSection } from "./BasicInfoSection";
import { LocationSection } from "./LocationSection";
import { DetailsSection } from "./DetailsSection";
import { PricingSection } from "./PricingSection";
import { FeaturesAmenitiesSection } from "./FeaturesAmenitiesSection";
import { ImagesSection } from "./ImagesSection";
import { PublishingSection } from "./PublishingSection";

interface PropertyFormProps {
    mode: "create" | "edit";
    propertyId: string;
    defaultValues?: Partial<PropertyFormValues>;
}

export function PropertyForm({ mode, propertyId, defaultValues }: PropertyFormProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<PropertyFormValues>({
        // zod's z.coerce.number() fields make the resolver's inferred input type
        // differ from its output type; the coercion is correct at runtime, so
        // the resolver is asserted to operate on the (post-coercion) form shape.
        resolver: zodResolver(propertySchema) as Resolver<PropertyFormValues>,
        defaultValues: { ...propertyFormDefaults, ...defaultValues },
    });

    const {
        formState: { isDirty },
    } = form;

    useEffect(() => {
        function handler(event: BeforeUnloadEvent) {
            if (isDirty) {
                event.preventDefault();
            }
        }
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    async function onSubmit(values: PropertyFormValues) {
        setSubmitting(true);
        try {
            if (mode === "create") {
                await createPropertyAction(propertyId, values);
            } else {
                await updatePropertyAction(propertyId, values);
            }
        } catch (error) {
            if (isNextRedirectError(error)) throw error;
            toast.error("Something went wrong while saving. Please try again.");
            setSubmitting(false);
        }
    }

    function handleCancel() {
        if (isDirty && !window.confirm("Discard unsaved changes?")) return;
        router.push("/dashboard/properties");
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-24">
                <BasicInfoSection mode={mode} />
                <LocationSection />
                <DetailsSection />
                <PricingSection />
                <FeaturesAmenitiesSection />
                <ImagesSection propertyId={propertyId} />
                <PublishingSection />

                <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-border bg-background/95 px-4 py-4 backdrop-blur lg:-mx-8 lg:px-8">
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                        {mode === "create" ? "Create Property" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
