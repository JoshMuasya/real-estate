"use client";

import { useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
    images: string[];
    title: string;
}

const SWIPE_THRESHOLD = 40;

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
    const [active, setActive] = useState(0);
    const touchStartX = useRef<number | null>(null);

    const hasMultiple = images.length > 1;

    function goTo(index: number) {
        setActive((index + images.length) % images.length);
    }

    function handleTouchStart(event: TouchEvent) {
        touchStartX.current = event.touches[0]?.clientX ?? null;
    }

    function handleTouchEnd(event: TouchEvent) {
        if (touchStartX.current === null) return;

        const deltaX = event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;

        if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

        goTo(active + (deltaX < 0 ? 1 : -1));
    }

    return (
        <div className="mt-12">
            <div
                className="relative aspect-[4/3] overflow-hidden bg-muted sm:aspect-[16/9]"
                onTouchStart={hasMultiple ? handleTouchStart : undefined}
                onTouchEnd={hasMultiple ? handleTouchEnd : undefined}
            >
                <Image
                    src={images[active]}
                    alt={`${title} — view ${active + 1}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 88rem"
                    className="object-cover"
                />

                {hasMultiple && (
                    <>
                        <button
                            type="button"
                            onClick={() => goTo(active - 1)}
                            aria-label="Previous image"
                            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background sm:left-4"
                        >
                            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                        </button>

                        <button
                            type="button"
                            onClick={() => goTo(active + 1)}
                            aria-label="Next image"
                            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background sm:right-4"
                        >
                            <ChevronRight className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                        </button>

                        <span className="absolute bottom-3 right-3 bg-background/80 px-2.5 py-1 text-xs font-medium tracking-[0.1em] text-foreground backdrop-blur-sm sm:hidden">
                            {active + 1} / {images.length}
                        </span>
                    </>
                )}
            </div>

            {hasMultiple && (
                <div className="-mx-6 mt-4 flex gap-3 overflow-x-auto px-6 pb-1 no-scrollbar sm:mx-0 sm:gap-4 sm:px-0">
                    {images.map((image, index) => (
                        <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() => goTo(index)}
                            aria-label={`Show image ${index + 1}`}
                            aria-pressed={index === active}
                            className={cn(
                                "relative h-16 w-24 shrink-0 overflow-hidden border transition-colors sm:h-20 sm:w-28 md:h-24 md:w-36",
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
