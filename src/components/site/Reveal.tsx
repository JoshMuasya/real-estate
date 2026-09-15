"use client";

import {
    useEffect,
    useRef,
    useState,
    type ComponentPropsWithoutRef,
    type ElementType,
    type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    as?: ElementType;
}

export function Reveal({
    children,
    className,
    delay = 0,
    as: Tag = "div",
}: RevealProps) {
    const ref = useRef<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;

        if (!node) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) {
                    return;
                }

                setVisible(true);
                observer.disconnect();
            },
            {
                rootMargin: "0px 0px -12% 0px",
                threshold: 0.05,
            },
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <Tag
            ref={ref}
            data-visible={visible}
            style={{
                transitionDelay: `${delay}ms`,
            }}
            className={cn("reveal", className)}
        >
            {children}
        </Tag>
    );
}