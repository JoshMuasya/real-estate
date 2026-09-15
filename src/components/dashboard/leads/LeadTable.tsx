"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteLeadAction, updateLeadStatusAction } from "@/app/dashboard/leads/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/dashboard/ConfirmDeleteDialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Lead, LeadStatus } from "@/lib/types";
import { isNextRedirectError } from "@/lib/utils";

const STATUS_VARIANT: Record<LeadStatus, "default" | "secondary" | "outline"> = {
    new: "default",
    contacted: "secondary",
    closed: "outline",
};

function formatDateTime(value: string) {
    return new Date(value).toLocaleString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export function LeadTable({ items, emptyMessage }: { items: Lead[]; emptyMessage: string }) {
    const [active, setActive] = useState<Lead | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Received</TableHead>
                        <TableHead className="w-10" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((lead) => (
                        <TableRow key={lead.id} className="cursor-pointer" onClick={() => setActive(lead)}>
                            <TableCell className="font-medium text-foreground">{lead.name}</TableCell>
                            <TableCell className="text-muted-foreground">
                                <div>{lead.email}</div>
                                <div className="text-xs">{lead.phone}</div>
                            </TableCell>
                            <TableCell className="max-w-52 truncate text-muted-foreground">
                                {lead.subject ?? "—"}
                            </TableCell>
                            <TableCell>
                                <Badge variant={STATUS_VARIANT[lead.status]} className="capitalize">
                                    {lead.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{formatDateTime(lead.createdAt)}</TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setDeleteTarget(lead);
                                    }}
                                    aria-label={`Delete lead from ${lead.name}`}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <LeadDetailSheet lead={active} onOpenChange={(open) => !open && setActive(null)} />

            {deleteTarget && (
                <ConfirmDeleteDialog
                    open={Boolean(deleteTarget)}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                    title={`Delete lead from "${deleteTarget.name}"?`}
                    description="This permanently removes the submission. This cannot be undone."
                    onConfirm={() => deleteLeadAction(deleteTarget.id)}
                />
            )}
        </div>
    );
}

function LeadDetailSheet({ lead, onOpenChange }: { lead: Lead | null; onOpenChange: (open: boolean) => void }) {
    const [, startTransition] = useTransition();

    return (
        <Sheet open={Boolean(lead)} onOpenChange={onOpenChange}>
            <SheetContent>
                {lead && (
                    <>
                        <SheetHeader>
                            <SheetTitle>{lead.name}</SheetTitle>
                            <SheetDescription>
                                Submitted {formatDateTime(lead.createdAt)}
                                {lead.subject ? ` · ${lead.subject}` : ""}
                            </SheetDescription>
                        </SheetHeader>

                        <div className="flex flex-col gap-4 px-4">
                            <div className="flex flex-col gap-1 text-sm">
                                <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-foreground hover:underline">
                                    <Mail className="size-4 text-muted-foreground" />
                                    {lead.email}
                                </a>
                                <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-foreground hover:underline">
                                    <Phone className="size-4 text-muted-foreground" />
                                    {lead.phone}
                                </a>
                            </div>

                            {lead.propertySlug && (
                                <Link
                                    href={`/properties/${lead.propertySlug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-primary underline-offset-4 hover:underline"
                                >
                                    View property listing →
                                </Link>
                            )}

                            {lead.message && (
                                <div>
                                    <p className="mb-1 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                                        Message
                                    </p>
                                    <p className="whitespace-pre-wrap text-sm text-foreground">{lead.message}</p>
                                </div>
                            )}

                            <div>
                                <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                                    Status
                                </p>
                                <Select
                                    value={lead.status}
                                    onValueChange={(value) => {
                                        const status = value as LeadStatus;
                                        startTransition(async () => {
                                            try {
                                                await updateLeadStatusAction(lead.id, status);
                                                toast.success("Status updated");
                                            } catch (error) {
                                                if (isNextRedirectError(error)) throw error;
                                                toast.error("Update failed");
                                            }
                                        });
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="contacted">Contacted</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
