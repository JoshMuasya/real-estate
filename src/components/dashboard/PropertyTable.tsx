"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, Eye, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    bulkSetPublishedAction,
    deletePropertyAction,
    duplicatePropertyAction,
    toggleFeaturedAction,
    togglePublishedAction,
} from "@/app/dashboard/properties/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/lib/data/properties";
import type { Property } from "@/lib/types";
import { isNextRedirectError } from "@/lib/utils";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export function PropertyTable({ items }: { items: Property[] }) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
    const [, startTransition] = useTransition();

    function toggleSelected(id: string) {
        setSelected((current) => {
            const next = new Set(current);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function toggleAll() {
        setSelected((current) => (current.size === items.length ? new Set() : new Set(items.map((p) => p.id))));
    }

    function bulkPublish(published: boolean) {
        const ids = Array.from(selected);
        startTransition(async () => {
            try {
                await bulkSetPublishedAction(ids, published);
                toast.success(published ? "Properties published" : "Properties unpublished");
                setSelected(new Set());
            } catch {
                toast.error("Bulk update failed");
            }
        });
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
                <p>No properties match these filters.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card">
            {selected.size > 0 && (
                <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
                    <span className="text-sm text-muted-foreground">{selected.size} selected</span>
                    <Button size="sm" variant="outline" onClick={() => bulkPublish(true)}>
                        Publish
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => bulkPublish(false)}>
                        Unpublish
                    </Button>
                </div>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10">
                            <Checkbox
                                checked={selected.size > 0 && selected.size === items.length}
                                onCheckedChange={toggleAll}
                                aria-label="Select all"
                            />
                        </TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Featured</TableHead>
                        <TableHead className="text-center">Published</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="w-10" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((property) => (
                        <TableRow key={property.id}>
                            <TableCell>
                                <Checkbox
                                    checked={selected.has(property.id)}
                                    onCheckedChange={() => toggleSelected(property.id)}
                                    aria-label={`Select ${property.title}`}
                                />
                            </TableCell>
                            <TableCell>
                                <Link href={`/dashboard/properties/${property.id}`} className="flex items-center gap-3">
                                    <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted">
                                        {property.images[0] && (
                                            <Image
                                                src={property.images[0]}
                                                alt={property.title}
                                                fill
                                                sizes="44px"
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-foreground">{property.title}</p>
                                        <p className="truncate text-xs text-muted-foreground">{property.location}</p>
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {property.propertyType}
                                <span className="block text-xs capitalize">{property.transactionType}</span>
                            </TableCell>
                            <TableCell>{formatPrice(property)}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{property.status}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                <FeaturedToggle property={property} />
                            </TableCell>
                            <TableCell className="text-center">
                                <PublishedToggle property={property} />
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {new Date(property.updatedAt).toLocaleDateString("en-KE", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </TableCell>
                            <TableCell>
                                <RowActions property={property} onDelete={() => setDeleteTarget(property)} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {deleteTarget && (
                <ConfirmDeleteDialog
                    open={Boolean(deleteTarget)}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                    title={`Delete "${deleteTarget.title}"?`}
                    description="This permanently removes the property and its images. This cannot be undone."
                    onConfirm={() => deletePropertyAction(deleteTarget.id)}
                />
            )}
        </div>
    );
}

function PublishedToggle({ property }: { property: Property }) {
    const [pending, startTransition] = useTransition();
    return (
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
            aria-label={`Toggle published for ${property.title}`}
        />
    );
}

function FeaturedToggle({ property }: { property: Property }) {
    const [pending, startTransition] = useTransition();
    return (
        <button
            type="button"
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
            aria-pressed={property.featured}
            aria-label={`Toggle featured for ${property.title}`}
            className="inline-flex size-7 items-center justify-center rounded-md transition-colors hover:bg-muted disabled:opacity-50"
        >
            <Star className={property.featured ? "size-4 fill-dash-accent text-dash-accent" : "size-4 text-muted-foreground"} />
        </button>
    );
}

function RowActions({ property, onDelete }: { property: Property; onDelete: () => void }) {
    const [, startTransition] = useTransition();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="size-4" />
                    </Button>
                }
            />
            <DropdownMenuContent align="end">
                <DropdownMenuItem render={<a href={`/properties/${property.slug}?preview=1`} target="_blank" rel="noreferrer" />}>
                    <Eye className="size-4" />
                    View / Preview
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href={`/dashboard/properties/${property.id}/edit`} />}>
                    <Pencil className="size-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        startTransition(async () => {
                            try {
                                await duplicatePropertyAction(property.id);
                            } catch (error) {
                                if (isNextRedirectError(error)) throw error;
                                toast.error("Duplicate failed");
                            }
                        });
                    }}
                >
                    <Copy className="size-4" />
                    Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                    <Trash2 className="size-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
