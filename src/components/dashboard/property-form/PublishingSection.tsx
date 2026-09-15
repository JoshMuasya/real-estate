"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { propertyStatusValues, type PropertyFormValues } from "@/lib/validation/property";
import { FormRow, SectionCard } from "./FormRow";

export function PublishingSection() {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<PropertyFormValues>();

    return (
        <SectionCard title="Publishing" description="Controls visibility on the public site and listing status.">
            <div className="grid gap-5 sm:grid-cols-2">
                <FormRow label="Status" error={errors.status?.message}>
                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {propertyStatusValues.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormRow>

                <div className="flex flex-col justify-center gap-3">
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
                    <Controller
                        control={control}
                        name="featured"
                        render={({ field }) => (
                            <label className="flex items-center justify-between gap-3 text-sm">
                                <span>
                                    <span className="block font-medium text-foreground">Featured</span>
                                    <span className="text-xs text-muted-foreground">Shown on the homepage</span>
                                </span>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </label>
                        )}
                    />
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-sm font-medium text-foreground">Listing Agent</h3>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    <FormRow label="Name" htmlFor="agent.name" error={errors.agent?.name?.message}>
                        <Input id="agent.name" {...register("agent.name")} />
                    </FormRow>
                    <FormRow label="Title" htmlFor="agent.title" error={errors.agent?.title?.message}>
                        <Input id="agent.title" {...register("agent.title")} />
                    </FormRow>
                    <FormRow label="Phone" htmlFor="agent.phone" error={errors.agent?.phone?.message}>
                        <Input id="agent.phone" {...register("agent.phone")} />
                    </FormRow>
                    <FormRow label="Email" htmlFor="agent.email" error={errors.agent?.email?.message}>
                        <Input id="agent.email" type="email" {...register("agent.email")} />
                    </FormRow>
                </div>
            </div>
        </SectionCard>
    );
}
