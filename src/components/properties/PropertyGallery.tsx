"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
    images: string[];
    title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
    const [active, setActive] = useState(0);

    return (
        <div className="mt-12">
            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                <Image
                    src={images[active]}
                    alt={`${title} — view ${active + 1}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 88rem"
                    className="object-cover"
                />
            </div>

            {images.length > 1 && (
                <div className="mt-4 flex gap-4">
                    {images.map((image, index) => (
                        <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() => setActive(index)}
                            aria-label={`Show image ${index + 1}`}
                            aria-pressed={index === active}
                            className={cn(
                                "relative h-20 w-28 overflow-hidden border transition-colors md:h-24 md:w-36",
                                index === active
                                    ? "border-primary"
                                    : "border-transparent opacity-70 hover:opacity-100",
                            )}
                        >
                            <Image
                                src={image}
                                alt={`${title} thumbnail ${index + 1}`}
                                fill
                                sizes="150px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
