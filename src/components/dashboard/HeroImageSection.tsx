"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { SectionCard } from "@/components/dashboard/property-form/FormRow";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

interface HeroImageSectionProps {
    title: string;
    description?: string;
    value: string;
    onChange: (url: string) => void;
    error?: string;
    entityId: string;
    uploadAction: (entityId: string, formData: FormData) => Promise<{ url: string }>;
    deleteAction: (url: string) => Promise<void>;
}

export function HeroImageSection({
    title,
    description,
    value,
    onChange,
    error,
    entityId,
    uploadAction,
    deleteAction,
}: HeroImageSectionProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleFiles(files: FileList | null) {
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!ACCEPTED_TYPES.includes(file.type)) {
            toast.error(`${file.name}: unsupported file type`);
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            toast.error(`${file.name}: file is larger than 8MB`);
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.set("file", file);
            const { url } = await uploadAction(entityId, formData);
            const previous = value;
            onChange(url);
            if (previous) {
                deleteAction(previous).catch(() => undefined);
            }
        } catch {
            toast.error(`Failed to upload ${file.name}`);
        } finally {
            setUploading(false);
        }
    }

    function remove() {
        const url = value;
        onChange("");
        if (url) {
            deleteAction(url).catch(() => undefined);
        }
    }

    return (
        <SectionCard title={title} description={description}>
            <div className="space-y-4">
                {value ? (
                    <div className="group relative aspect-[3/2] w-full max-w-sm overflow-hidden rounded-lg border border-border bg-muted">
                        <Image src={value} alt="" fill sizes="400px" className="object-cover" />
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/60 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                            <button
                                type="button"
                                onClick={remove}
                                aria-label="Remove image"
                                className="rounded p-1 text-white hover:bg-destructive/80"
                            >
                                <Trash2 className="size-3.5" />
                            </button>
                        </div>
                    </div>
                ) : (
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
                        <p className="text-sm text-muted-foreground">Drag and drop an image here, or click to browse</p>
                        <p className="text-xs text-muted-foreground">JPEG, PNG, WEBP or AVIF, up to 8MB</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={ACCEPTED_TYPES.join(",")}
                            className="hidden"
                            onChange={(event) => {
                                handleFiles(event.target.files);
                                event.target.value = "";
                            }}
                        />
                    </div>
                )}

                {error && <p className="text-xs text-destructive">{error}</p>}
                {uploading && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Uploading…
                    </p>
                )}
            </div>
        </SectionCard>
    );
}
