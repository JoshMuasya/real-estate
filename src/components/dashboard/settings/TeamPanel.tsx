"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    createTeamMemberAction,
    deleteTeamMemberAction,
    updateTeamMemberRoleAction,
    type SettingsActionState,
} from "@/app/dashboard/settings/actions";
import { ConfirmDeleteDialog } from "@/components/dashboard/ConfirmDeleteDialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { UserProfile } from "@/lib/firebase/users";
import type { UserRole } from "@/lib/types";

export function TeamPanel({ members, currentUid }: { members: UserProfile[]; currentUid: string }) {
    const [addOpen, setAddOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<UserProfile | null>(null);

    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                    <h2 className="font-serif text-xl text-foreground">Team</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Manage staff access to the dashboard.</p>
                </div>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger render={<Button />}>
                        <Plus className="size-4" />
                        Add team member
                    </DialogTrigger>
                    <AddTeamMemberDialog onDone={() => setAddOpen(false)} />
                </Dialog>
            </div>

            {members.length === 0 ? (
                <div className="flex flex-col items-center gap-3 p-16 text-center text-muted-foreground">
                    <p>No team members yet.</p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="w-10" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.uid}>
                                <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                                <TableCell>
                                    <RoleSelect member={member} />
                                </TableCell>
                                <TableCell>
                                    {member.uid !== currentUid && (
                                        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(member)}>
                                            <Trash2 className="size-4" />
                                            <span className="sr-only">Delete {member.name}</span>
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {deleteTarget && (
                <ConfirmDeleteDialog
                    open={Boolean(deleteTarget)}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                    title={`Remove ${deleteTarget.name}?`}
                    description="This permanently removes their access to the dashboard. This cannot be undone."
                    onConfirm={async () => {
                        await deleteTeamMemberAction(deleteTarget.uid);
                        toast.success("Team member removed");
                    }}
                />
            )}
        </div>
    );
}

function RoleSelect({ member }: { member: UserProfile }) {
    const [pending, startTransition] = useTransition();

    return (
        <Select
            value={member.role}
            disabled={pending}
            onValueChange={(role) => {
                startTransition(async () => {
                    try {
                        await updateTeamMemberRoleAction(member.uid, role as UserRole);
                        toast.success("Role updated");
                    } catch {
                        toast.error("Update failed");
                    }
                });
            }}
        >
            <SelectTrigger size="sm">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
            </SelectContent>
        </Select>
    );
}

function AddSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Add team member
        </Button>
    );
}

function AddTeamMemberDialog({ onDone }: { onDone: () => void }) {
    const [state, formAction] = useActionState<SettingsActionState, FormData>(createTeamMemberAction, undefined);

    useEffect(() => {
        if (state?.success) {
            toast.success("Team member added");
            onDone();
        }
    }, [state, onDone]);

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add team member</DialogTitle>
                <DialogDescription>Creates a new dashboard account with the selected role.</DialogDescription>
            </DialogHeader>

            <form action={formAction} className="flex flex-col gap-4" noValidate>
                {state?.error ? (
                    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        <span>{state.error}</span>
                    </div>
                ) : null}

                <div className="flex flex-col gap-2">
                    <Label htmlFor="member-name">Name</Label>
                    <Input id="member-name" name="name" required />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="member-email">Email</Label>
                    <Input id="member-email" name="email" type="email" autoComplete="off" required />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="member-password">Password</Label>
                    <Input id="member-password" name="password" type="password" autoComplete="new-password" required />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="member-role">Role</Label>
                    <Select name="role" defaultValue="agent">
                        <SelectTrigger id="member-role" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <AddSubmitButton />
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
