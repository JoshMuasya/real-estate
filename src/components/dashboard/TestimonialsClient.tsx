"use client";

import { useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    createTestimonialAction,
    deleteTestimonialAction,
    toggleTestimonialPublishedAction,
    updateTestimonialAction,
} from "@/app/dashboard/testimonials/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Testimonial } from "@/lib/types";
import { testimonialFormDefaults, testimonialSchema, type TestimonialFormValues } from "@/lib/validation/testimonial";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export function TestimonialsClient({ items }: { items: Testimonial[] }) {
    const [search, setSearch] = useState("");
    const [formTarget, setFormTarget] = useState<Testimonial | null | undefined>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;
        return items.filter(
            (t) => t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q) || t.quote.toLowerCase().includes(q),
        );
    }, [search, items]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search testimonials"
                        className="h-9 pl-8"
                        aria-label="Search testimonials"
                    />
                </div>
                <Button onClick={() => setFormTarget(null)}>
                    <Plus className="size-4" />
                    Add Testimonial
                </Button>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
                    <p>No testimonials match this search.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Quote</TableHead>
                                <TableHead className="text-center">Published</TableHead>
                                <TableHead className="w-20" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((testimonial) => (
                                <TableRow key={testimonial.id}>
                                    <TableCell className="font-medium text-foreground">{testimonial.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{testimonial.role}</TableCell>
                                    <TableCell className="max-w-xs truncate text-muted-foreground">{testimonial.quote}</TableCell>
                                    <TableCell className="text-center">
                                        <PublishedToggle testimonial={testimonial} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                aria-label={`Edit ${testimonial.name}`}
                                                onClick={() => setFormTarget(testimonial)}
                                            >
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                aria-label={`Delete ${testimonial.name}`}
                                                onClick={() => setDeleteTarget(testimonial)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {formTarget !== undefined && (
                <TestimonialFormDialog testimonial={formTarget} onOpenChange={(open) => !open && setFormTarget(undefined)} />
            )}

            {deleteTarget && (
                <ConfirmDeleteDialog
                    open={Boolean(deleteTarget)}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                    title={`Delete "${deleteTarget.name}"?`}
                    description="This permanently removes the testimonial. This cannot be undone."
                    onConfirm={() => deleteTestimonialAction(deleteTarget.id)}
                />
            )}
        </div>
    );
}

function PublishedToggle({ testimonial }: { testimonial: Testimonial }) {
    const [pending, startTransition] = useTransition();
    return (
        <Switch
            checked={testimonial.published}
            disabled={pending}
            onCheckedChange={(checked) => {
                startTransition(async () => {
                    try {
                        await toggleTestimonialPublishedAction(testimonial.id, checked);
                        toast.success(checked ? "Published" : "Unpublished");
                    } catch {
                        toast.error("Update failed");
                    }
                });
            }}
            aria-label={`Toggle published for ${testimonial.name}`}
        />
    );
}

function TestimonialFormDialog({
    testimonial,
    onOpenChange,
}: {
    testimonial: Testimonial | null;
    onOpenChange: (open: boolean) => void;
}) {
    const [submitting, setSubmitting] = useState(false);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<TestimonialFormValues>({
        // zod's .default() fields make the resolver's inferred input type
        // differ from its output type; the default is applied at runtime, so
        // the resolver is asserted to operate on the (post-default) form shape.
        resolver: zodResolver(testimonialSchema) as Resolver<TestimonialFormValues>,
        defaultValues: testimonial
            ? { name: testimonial.name, role: testimonial.role, quote: testimonial.quote, published: testimonial.published }
            : testimonialFormDefaults,
    });

    async function onSubmit(values: TestimonialFormValues) {
        setSubmitting(true);
        try {
            if (testimonial) {
                await updateTestimonialAction(testimonial.id, values);
                toast.success("Testimonial updated");
            } else {
                await createTestimonialAction(values);
                toast.success("Testimonial created");
            }
            onOpenChange(false);
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{testimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register("name")} />
                            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" {...register("role")} placeholder="e.g. Homeowner, Nairobi" />
                            {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="quote">Quote</Label>
                            <Textarea id="quote" rows={4} {...register("quote")} />
                            {errors.quote && <p className="text-xs text-destructive">{errors.quote.message}</p>}
                        </div>

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
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader2 className="size-4 animate-spin" />}
                            {testimonial ? "Save Changes" : "Create Testimonial"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
