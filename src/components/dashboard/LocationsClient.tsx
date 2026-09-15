"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteLocationAction, togglePublishedAction } from "@/app/dashboard/locations/actions";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FeaturedLocation } from "@/lib/types";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export function LocationsClient({ items }: { items: FeaturedLocation[] }) {
    const [deleteTarget, setDeleteTarget] = useState<FeaturedLocation | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button render={<Link href="/dashboard/locations/new" />}>
                    <Plus className="size-4" />
                    Add Location
                </Button>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
                    <p>No locations yet.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Location</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Published</TableHead>
                                <TableHead className="w-10" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((location) => (
                                <TableRow key={location.id}>
                                    <TableCell>
                                        <Link href={`/dashboard/locations/${location.id}/edit`} className="flex items-center gap-3">
                                            <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted">
                                                {location.image && (
                                                    <Image
                                                        src={location.image}
                                                        alt={location.name}
                                                        fill
                                                        sizes="44px"
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <p className="font-medium text-foreground">{location.name}</p>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="max-w-sm truncate text-muted-foreground">
                                        {location.description}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <PublishedToggle location={location} />
                                    </TableCell>
                                    <TableCell>
                                        <RowActions location={location} onDelete={() => setDeleteTarget(location)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {deleteTarget && (
                <ConfirmDeleteDialog
                    open={Boolean(deleteTarget)}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                    title={`Delete "${deleteTarget.name}"?`}
                    description="This permanently removes the location and its image. This cannot be undone."
                    onConfirm={() => deleteLocationAction(deleteTarget.id)}
                />
            )}
        </div>
    );
}

function PublishedToggle({ location }: { location: FeaturedLocation }) {
    const [pending, startTransition] = useTransition();
    return (
        <Switch
            checked={location.published}
            disabled={pending}
            onCheckedChange={(checked) => {
                startTransition(async () => {
                    try {
                        await togglePublishedAction(location.id, checked);
                        toast.success(checked ? "Published" : "Unpublished");
                    } catch {
                        toast.error("Update failed");
                    }
                });
            }}
            aria-label={`Toggle published for ${location.name}`}
        />
    );
}

function RowActions({ location, onDelete }: { location: FeaturedLocation; onDelete: () => void }) {
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
                <DropdownMenuItem render={<Link href={`/dashboard/locations/${location.id}/edit`} />}>
                    <Pencil className="size-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                    <Trash2 className="size-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
