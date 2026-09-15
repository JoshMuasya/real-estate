"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Copy, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { deleteMediaAction, listMoreMediaAction, uploadMediaAction } from "@/app/dashboard/media/actions";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/dashboard/ConfirmDeleteDialog";
import { cn } from "@/lib/utils";
import type { MediaFile } from "@/lib/firebase/media";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** exponent;
    return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
}

export function MediaLibraryClient({
    initialItems,
    initialNextPageToken,
}: {
    initialItems: MediaFile[];
    initialNextPageToken?: string;
}) {
    const [items, setItems] = useState(initialItems);
    const [nextPageToken, setNextPageToken] = useState(initialNextPageToken);
    const [uploading, setUploading] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
    const [, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleFiles(files: FileList | null) {
        if (!files || files.length === 0) return;
        const valid = Array.from(files).filter((file) => {
            if (!ACCEPTED_TYPES.includes(file.type)) {
                toast.error(`${file.name}: unsupported file type`);
                return false;
            }
            if (file.size > MAX_IMAGE_BYTES) {
                toast.error(`${file.name}: file is larger than 8MB`);
                return false;
            }
            return true;
        });

        setUploading((count) => count + valid.length);
        for (const file of valid) {
            try {
                const formData = new FormData();
                formData.set("file", file);
                const { file: uploaded } = await uploadMediaAction(formData);
                setItems((current) => [uploaded, ...current]);
            } catch {
                toast.error(`Failed to upload ${file.name}`);
            } finally {
                setUploading((count) => count - 1);
            }
        }
    }

    async function copyUrl(url: string) {
        await navigator.clipboard.writeText(url);
        toast.success("URL copied");
    }

    function loadMore() {
        if (!nextPageToken) return;
        setLoadingMore(true);
        startTransition(async () => {
            try {
                const result = await listMoreMediaAction(nextPageToken);
                setItems((current) => [...current, ...result.items]);
                setNextPageToken(result.nextPageToken);
            } catch {
                toast.error("Failed to load more files");
            } finally {
                setLoadingMore(false);
            }
        });
    }

    return (
        <div className="space-y-6">
            <div
                onDragOver={(event) => {
                    event.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    setDragOver(false);
                    handleFiles(event.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click();
                }}
                className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-10 text-center transition-colors",
                    dragOver && "border-dash-active bg-dash-active/5",
                )}
            >
                <UploadCloud className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag and drop files here, or click to browse</p>
                <p className="text-xs text-muted-foreground">JPEG, PNG, WEBP or AVIF, up to 8MB each</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED_TYPES.join(",")}
                    className="hidden"
                    onChange={(event) => {
                        handleFiles(event.target.files);
                        event.target.value = "";
                    }}
                />
            </div>

            {uploading > 0 && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Uploading {uploading} file{uploading > 1 ? "s" : ""}…
                </p>
            )}

            {items.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
                    <p>No files uploaded yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {items.map((item) => (
                        <div
                            key={item.name}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                        >
                            <Image src={item.url} alt={item.name} fill sizes="200px" className="object-cover" />
                            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-black/70 p-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                                <p className="truncate text-[0.7rem] text-white" title={item.name}>
                                    {item.name}
                                </p>
                                <p className="text-[0.65rem] text-white/70">{formatBytes(item.size)}</p>
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        type="button"
                                        onClick={() => copyUrl(item.url)}
                                        aria-label="Copy URL"
                                        className="rounded p-1 text-white hover:bg-white/20"
                                    >
                                        <Copy className="size-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteTarget(item)}
                                        aria-label="Delete file"
                                        className="rounded p-1 text-white hover:bg-destructive/80"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {nextPageToken && (
                <div className="flex justify-center">
                    <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                        {loadingMore && <Loader2 className="size-4 animate-spin" />}
                        Load more
                    </Button>
                </div>
            )}

            {deleteTarget && (
                <ConfirmDeleteDialog
                    open={Boolean(deleteTarget)}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                    title={`Delete "${deleteTarget.name}"?`}
                    description="This permanently removes the file from storage. This cannot be undone."
                    onConfirm={async () => {
                        await deleteMediaAction(`media/${deleteTarget.name}`);
                        setItems((current) => current.filter((item) => item.name !== deleteTarget.name));
                    }}
                />
            )}
        </div>
    );
}
