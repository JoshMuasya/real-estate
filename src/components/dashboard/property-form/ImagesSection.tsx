"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Controller, useFormContext } from "react-hook-form";
import { ArrowLeft, ArrowRight, Loader2, Star, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { deleteImageAction, uploadImageAction } from "@/app/dashboard/properties/actions";
import { cn } from "@/lib/utils";
import type { PropertyFormValues } from "@/lib/validation/property";
import { SectionCard } from "./FormRow";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export function ImagesSection({ propertyId }: { propertyId: string }) {
    const { control } = useFormContext<PropertyFormValues>();
    const [uploading, setUploading] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <SectionCard title="Images" description="Drag to reorder. The first image is the primary listing photo.">
            <Controller
                control={control}
                name="images"
                render={({ field, fieldState }) => {
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
                                const { url } = await uploadImageAction(propertyId, formData);
                                field.onChange([...field.value, url]);
                            } catch {
                                toast.error(`Failed to upload ${file.name}`);
                            } finally {
                                setUploading((count) => count - 1);
                            }
                        }
                    }

                    function move(index: number, direction: -1 | 1) {
                        const next = [...field.value];
                        const target = index + direction;
                        if (target < 0 || target >= next.length) return;
                        [next[index], next[target]] = [next[target], next[index]];
                        field.onChange(next);
                    }

                    function removeAt(index: number) {
                        const url = field.value[index];
                        field.onChange(field.value.filter((_, i) => i !== index));
                        deleteImageAction(url).catch(() => undefined);
                    }

                    function handleDragStart(event: React.DragEvent, index: number) {
                        event.dataTransfer.setData("text/plain", String(index));
                    }

                    function handleDropReorder(event: React.DragEvent, index: number) {
                        event.preventDefault();
                        const from = Number(event.dataTransfer.getData("text/plain"));
                        if (Number.isNaN(from) || from === index) return;
                        const next = [...field.value];
                        const [moved] = next.splice(from, 1);
                        next.splice(index, 0, moved);
                        field.onChange(next);
                    }

                    return (
                        <div className="space-y-4">
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
                                <p className="text-sm text-muted-foreground">
                                    Drag and drop images here, or click to browse
                                </p>
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

                            {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                            {uploading > 0 && (
                                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="size-4 animate-spin" />
                                    Uploading {uploading} image{uploading > 1 ? "s" : ""}…
                                </p>
                            )}

                            {field.value.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                    {field.value.map((url, index) => (
                                        <div
                                            key={url}
                                            draggable
                                            onDragStart={(event) => handleDragStart(event, index)}
                                            onDragOver={(event) => event.preventDefault()}
                                            onDrop={(event) => handleDropReorder(event, index)}
                                            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
                                        >
                                            <Image src={url} alt="" fill sizes="200px" className="object-cover" />
                                            {index === 0 && (
                                                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-dash-active px-2 py-0.5 text-[0.65rem] font-medium text-dash-active-foreground">
                                                    <Star className="size-3 fill-current" />
                                                    Primary
                                                </span>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/60 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={() => move(index, -1)}
                                                    disabled={index === 0}
                                                    aria-label="Move left"
                                                    className="rounded p-1 text-white hover:bg-white/20 disabled:opacity-30"
                                                >
                                                    <ArrowLeft className="size-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange([url, ...field.value.filter((u) => u !== url)])}
                                                    aria-label="Set as primary"
                                                    className="rounded p-1 text-white hover:bg-white/20"
                                                >
                                                    <Star className="size-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => move(index, 1)}
                                                    disabled={index === field.value.length - 1}
                                                    aria-label="Move right"
                                                    className="rounded p-1 text-white hover:bg-white/20 disabled:opacity-30"
                                                >
                                                    <ArrowRight className="size-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAt(index)}
                                                    aria-label="Delete image"
                                                    className="rounded p-1 text-white hover:bg-destructive/80"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                }}
            />
        </SectionCard>
    );
}
