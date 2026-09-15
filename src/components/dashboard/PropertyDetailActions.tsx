"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Loader2, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deletePropertyAction, duplicatePropertyAction, toggleFeaturedAction, togglePublishedAction } from "@/app/dashboard/properties/actions";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Property } from "@/lib/types";
import { isNextRedirectError } from "@/lib/utils";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export function PropertyDetailActions({ property }: { property: Property }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [duplicating, startDuplicate] = useTransition();
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                Published
                <Switch
                    checked={property.published}
                    disabled={pending}
                    onCheckedChange={(checked) => {
                        startTransition(async () => {
                            try {
                                await togglePublishedAction(property.id, checked);
                                toast.success(checked ? "Published" : "Unpublished");
                            } catch {
                                toast.error("Update failed");
                            }
                        });
                    }}
                />
            </label>

            <Button
                variant="outline"
                disabled={pending}
                onClick={() => {
                    startTransition(async () => {
                        try {
                            await toggleFeaturedAction(property.id, !property.featured);
                        } catch {
                            toast.error("Update failed");
                        }
                    });
                }}
            >
                <Star className={property.featured ? "size-4 fill-dash-accent text-dash-accent" : "size-4"} />
                {property.featured ? "Featured" : "Feature"}
            </Button>

            <Button variant="outline" render={<Link href={`/dashboard/properties/${property.id}/edit`} />}>
                <Pencil className="size-4" />
                Edit
            </Button>

            <Button
                variant="outline"
                disabled={duplicating}
                onClick={() => {
                    startDuplicate(async () => {
                        try {
                            await duplicatePropertyAction(property.id);
                        } catch (error) {
                            if (isNextRedirectError(error)) throw error;
                            toast.error("Duplicate failed");
                        }
                    });
                }}
            >
                {duplicating ? <Loader2 className="size-4 animate-spin" /> : <Copy className="size-4" />}
                Duplicate
            </Button>

            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="size-4" />
                Delete
            </Button>

            <ConfirmDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title={`Delete "${property.title}"?`}
                description="This permanently removes the property and its images. This cannot be undone."
                onConfirm={async () => {
                    await deletePropertyAction(property.id);
                    router.push("/dashboard/properties");
                }}
            />
        </div>
    );
}
