"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
    { label: "Properties", href: "/properties" },
    { label: "Buy", href: "/buy" },
    { label: "Rent", href: "/rent" },
    { label: "Sell With Us", href: "/sell" },
    { label: "Developments", href: "/developments" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/insights" },
];

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 24);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const isScrolledOrOpen = scrolled || open;

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500",
                isScrolledOrOpen
                    ? "border-b border-border bg-background/95 backdrop-blur-md"
                    : "border-b border-transparent bg-transparent",
            )}
        >
            <div className="mx-auto flex h-20 max-w-[88rem] items-center justify-between px-6 lg:px-10">
                {/* Logo */}
                <Link
                    href="/"
                    className="group flex items-center gap-3"
                    onClick={() => setOpen(false)}
                    aria-label="Loymax Properties home"
                >
                    <span
                        className={cn(
                            "block h-8 w-px transition-colors duration-500",
                            isScrolledOrOpen
                                ? "bg-brand"
                                : "bg-primary-foreground/60",
                        )}
                    />

                    <span
                        className={cn(
                            "leading-[0.95] transition-colors duration-500",
                            isScrolledOrOpen
                                ? "text-foreground"
                                : "text-primary-foreground",
                        )}
                    >
                        <span className="block font-serif text-xl tracking-[0.28em]">
                            LOYMAX
                        </span>

                        <span className="block text-[0.55rem] font-medium uppercase tracking-[0.2em] opacity-70">
                            Properties
                        </span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav
                    aria-label="Primary navigation"
                    className="hidden items-center gap-8 xl:flex"
                >
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            href={item.href}
                            scrolled={scrolled}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/properties"
                        aria-label="Search properties"
                        className={cn(
                            "hidden h-9 w-9 items-center justify-center transition-colors duration-300 sm:flex",
                            scrolled
                                ? "text-foreground hover:text-primary"
                                : "text-primary-foreground hover:text-primary-foreground/70",
                        )}
                    >
                        <Search
                            className="h-4 w-4"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                    </Link>

                    <Link
                        href="/contact"
                        className="hidden bg-primary px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors duration-300 hover:bg-primary/85 lg:inline-block"
                    >
                        Book a Consultation
                    </Link>

                    <button
                        type="button"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        aria-controls="mobile-navigation"
                        onClick={() => setOpen((value) => !value)}
                        className={cn(
                            "flex h-9 w-9 items-center justify-center xl:hidden",
                            isScrolledOrOpen
                                ? "text-foreground"
                                : "text-primary-foreground",
                        )}
                    >
                        {open ? (
                            <X
                                className="h-5 w-5"
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                        ) : (
                            <Menu
                                className="h-5 w-5"
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {open && (
                <div
                    id="mobile-navigation"
                    className="fixed inset-0 top-20 z-40 flex flex-col justify-between bg-background px-6 pb-12 pt-10 xl:hidden"
                >
                    <nav
                        aria-label="Mobile navigation"
                        className="flex flex-col"
                    >
                        {navItems.map((item, index) => (
                            <MobileNavLink
                                key={item.href}
                                href={item.href}
                                index={index}
                                onClick={() => setOpen(false)}
                            >
                                {item.label}
                            </MobileNavLink>
                        ))}
                    </nav>

                    <Link
                        href="/contact"
                        onClick={() => setOpen(false)}
                        className="mt-10 block bg-primary py-4 text-center text-[0.72rem] font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/85"
                    >
                        Book a Consultation
                    </Link>
                </div>
            )}
        </header>
    );
}

interface NavLinkProps {
    href: string;
    scrolled: boolean;
    children: React.ReactNode;
}

function NavLink({
    href,
    scrolled,
    children,
}: NavLinkProps) {
    return (
        <Link
            href={href}
            className={cn(
                "relative py-1 text-[0.8rem] tracking-[0.08em] transition-colors duration-300",
                scrolled
                    ? "text-foreground hover:text-primary"
                    : "text-primary-foreground/85 hover:text-primary-foreground",
            )}
        >
            {children}
        </Link>
    );
}

interface MobileNavLinkProps {
    href: string;
    index: number;
    onClick: () => void;
    children: React.ReactNode;
}

function MobileNavLink({
    href,
    index,
    onClick,
    children,
}: MobileNavLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            style={{
                animationDelay: `${index * 45}ms`,
            }}
            className="border-b border-border py-4 font-serif text-3xl text-foreground transition-colors duration-300 hover:text-primary animate-in fade-in slide-in-from-bottom-2"
        >
            {children}
        </Link>
    );
}