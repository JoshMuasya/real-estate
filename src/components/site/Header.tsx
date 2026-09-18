"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, Search, X } from "lucide-react";

import { contactDetails } from "@/lib/data/site";
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

function isActive(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    // Only the homepage puts a full-bleed dark hero behind the fixed header. Every other page
    // starts on a light background, where the light-on-transparent treatment is invisible.
    const overHero = pathname === "/";

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

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    const solid = !overHero || scrolled || open;

    return (
        <>
            <header
                className={cn(
                    "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300",
                    solid ? "bg-background/95 backdrop-blur-md" : "bg-transparent",
                    // The open menu fills the whole screen behind this bar — a divider would cut it in two.
                    solid && !open ? "border-border" : "border-transparent",
                )}
            >
                <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between px-5 sm:px-6 lg:h-20 lg:px-10">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                        onClick={() => setOpen(false)}
                        aria-label="Loymax Properties home"
                    >
                        <span
                            className={cn(
                                "block h-7 w-px transition-colors duration-300 lg:h-8",
                                solid ? "bg-brand" : "bg-primary-foreground/60",
                            )}
                        />

                        <span
                            className={cn(
                                "leading-[0.95] transition-colors duration-300",
                                solid ? "text-foreground" : "text-primary-foreground",
                            )}
                        >
                            <span className="block font-serif text-lg tracking-[0.28em] lg:text-xl">
                                LOYMAX
                            </span>

                            <span className="block text-[0.5rem] font-medium uppercase tracking-[0.2em] opacity-70 lg:text-[0.55rem]">
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
                                solid={solid}
                                active={isActive(pathname, item.href)}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-4">
                        <Link
                            href="/properties"
                            aria-label="Search properties"
                            className={cn(
                                "hidden h-10 w-10 items-center justify-center transition-colors duration-300 sm:flex",
                                solid
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
                                "-mr-2 flex h-11 w-11 items-center justify-center transition-colors duration-300 xl:hidden",
                                solid ? "text-foreground" : "text-primary-foreground",
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
            </header>

            {/* Mobile Navigation — a sibling of the header, not a child: the header's
                backdrop-filter would otherwise become this panel's containing block and
                trap it inside the 64px bar. */}
            {open && (
                <div
                    id="mobile-navigation"
                    className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-background px-5 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-[5.5rem] sm:px-6 lg:pt-[6.5rem] xl:hidden"
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
                                active={isActive(pathname, item.href)}
                                onClick={() => setOpen(false)}
                            >
                                {item.label}
                            </MobileNavLink>
                        ))}
                    </nav>

                    <div className="mt-auto pt-8">
                        <Link
                            href="/contact"
                            onClick={() => setOpen(false)}
                            className="block bg-primary py-4 text-center text-[0.72rem] font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/85"
                        >
                            Book a Consultation
                        </Link>

                        <a
                            href={`tel:${contactDetails.phone}`}
                            className="mt-5 flex items-center justify-center gap-2 text-xs tracking-[0.12em] text-muted-foreground transition-colors hover:text-brand"
                        >
                            <Phone
                                className="h-3.5 w-3.5"
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                            {contactDetails.phone}
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}

interface NavLinkProps {
    href: string;
    solid: boolean;
    active: boolean;
    children: React.ReactNode;
}

function NavLink({
    href,
    solid,
    active,
    children,
}: NavLinkProps) {
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
                "relative py-1 text-[0.8rem] tracking-[0.08em] transition-colors duration-300",
                solid
                    ? active
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
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
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

function MobileNavLink({
    href,
    index,
    active,
    onClick,
    children,
}: MobileNavLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            aria-current={active ? "page" : undefined}
            style={{
                animationDelay: `${index * 45}ms`,
            }}
            className={cn(
                "flex items-center justify-between border-b border-border py-3.5 font-serif text-2xl transition-colors duration-300 animate-in fade-in slide-in-from-bottom-2 sm:text-3xl",
                active ? "text-primary" : "text-foreground hover:text-primary",
            )}
        >
            {children}

            {active && (
                <span
                    className="block h-px w-6 bg-brand"
                    aria-hidden="true"
                />
            )}
        </Link>
    );
}
