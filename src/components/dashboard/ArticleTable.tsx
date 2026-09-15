"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteArticleAction, toggleFeaturedAction, togglePublishedAction } from "@/app/dashboard/insights/actions";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Article } from "@/lib/types";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export function ArticleTable({ items }: { items: Article[] }) {
    const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
                <p>No articles match these filters.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Article</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-center">Featured</TableHead>
                        <TableHead className="text-center">Published</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="w-10" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((article) => (
                        <TableRow key={article.id}>
                            <TableCell>
                                <Link href={`/dashboard/insights/${article.id}/edit`} className="flex items-center gap-3">
                                    <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted">
                                        {article.image && (
                                            <Image
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                sizes="44px"
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-foreground">{article.title}</p>
                                        <p className="truncate text-xs text-muted-foreground">{article.readingTime}</p>
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{article.category}</TableCell>
                            <TableCell className="text-center">
                                <FeaturedToggle article={article} />
                            </TableCell>
                            <TableCell className="text-center">
                                <PublishedToggle article={article} />
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {new Date(article.updatedAt).toLocaleDateString("en-KE", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </TableCell>
                            <TableCell>
                                <RowActions article={article} onDelete={() => setDeleteTarget(article)} />
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
                    description="This permanently removes the article and its hero image. This cannot be undone."
                    onConfirm={() => deleteArticleAction(deleteTarget.id)}
                />
            )}
        </div>
    );
}

function PublishedToggle({ article }: { article: Article }) {
    const [pending, startTransition] = useTransition();
    return (
        <Switch
            checked={article.published}
            disabled={pending}
            onCheckedChange={(checked) => {
                startTransition(async () => {
                    try {
                        await togglePublishedAction(article.id, checked);
                        toast.success(checked ? "Published" : "Unpublished");
                    } catch {
                        toast.error("Update failed");
                    }
                });
            }}
            aria-label={`Toggle published for ${article.title}`}
        />
    );
}

function FeaturedToggle({ article }: { article: Article }) {
    const [pending, startTransition] = useTransition();
    return (
        <button
            type="button"
            disabled={pending}
            onClick={() => {
                startTransition(async () => {
                    try {
                        await toggleFeaturedAction(article.id, !article.featured);
                    } catch {
                        toast.error("Update failed");
                    }
                });
            }}
            aria-pressed={article.featured}
            aria-label={`Toggle featured for ${article.title}`}
            className="inline-flex size-7 items-center justify-center rounded-md transition-colors hover:bg-muted disabled:opacity-50"
        >
            <Star className={article.featured ? "size-4 fill-dash-accent text-dash-accent" : "size-4 text-muted-foreground"} />
        </button>
    );
}

function RowActions({ article, onDelete }: { article: Article; onDelete: () => void }) {
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
                <DropdownMenuItem render={<Link href={`/dashboard/insights/${article.id}/edit`} />}>
                    <Pencil className="size-4" />
                    Edit
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
