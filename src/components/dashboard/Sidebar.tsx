"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, type LucideIcon } from "lucide-react";

import { LoymaxLogo } from "@/components/brand/LoymaxLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";
import { navSectionsForRole, type NavItem } from "./NavConfig";

interface SidebarProps {
    role: UserRole;
    mobileOpen: boolean;
    onMobileOpenChange: (open: boolean) => void;
}

export function Sidebar({ role, mobileOpen, onMobileOpenChange }: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const sections = navSectionsForRole(role);

    return (
        <>
            <aside
                className={cn(
                    "hidden shrink-0 flex-col border-r border-border bg-background transition-[width] duration-200 lg:flex",
                    collapsed ? "w-[4.5rem]" : "w-64",
                )}
            >
                <SidebarNav collapsed={collapsed} pathname={pathname} sections={sections} />
                <div className="border-t border-border p-3">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="w-full"
                        onClick={() => setCollapsed((value) => !value)}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
                    </Button>
                </div>
            </aside>

            <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
                <SheetContent side="left" className="w-72 gap-0 p-0">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <SheetDescription className="sr-only">Dashboard navigation menu</SheetDescription>
                    <SidebarNav
                        collapsed={false}
                        pathname={pathname}
                        sections={sections}
                        onNavigate={() => onMobileOpenChange(false)}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
}

function SidebarNav({
    collapsed,
    pathname,
    sections,
    onNavigate,
}: {
    collapsed: boolean;
    pathname: string;
    sections: { heading: string; items: NavItem[] }[];
    onNavigate?: () => void;
}) {
    return (
        <div className="flex h-full flex-col overflow-y-auto">
            <div className="flex h-20 items-center border-b border-border px-5">
                <Link href="/dashboard" onClick={onNavigate} className="text-foreground" aria-label="Loymax Properties dashboard">
                    {collapsed ? (
                        <span className="block h-8 w-px bg-dash-active" />
                    ) : (
                        <LoymaxLogo textClassName="text-foreground" barClassName="bg-dash-active" />
                    )}
                </Link>
            </div>

            <nav className="flex-1 space-y-6 px-3 py-6">
                {sections.map((section) => (
                    <div key={section.heading}>
                        {!collapsed && (
                            <p className="px-2.5 pb-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                {section.heading}
                            </p>
                        )}
                        <ul className="space-y-1">
                            {section.items.map((item) => (
                                <li key={item.href}>
                                    <NavLink item={item} collapsed={collapsed} pathname={pathname} onNavigate={onNavigate} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </div>
    );
}

function NavLink({
    item,
    collapsed,
    pathname,
    onNavigate,
}: {
    item: NavItem;
    collapsed: boolean;
    pathname: string;
    onNavigate?: () => void;
}) {
    const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
    const Icon: LucideIcon = item.icon;

    const link = (
        <Link
            href={item.href}
            onClick={onNavigate}
            className={cn(
                "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                collapsed && "justify-center",
                active
                    ? "bg-dash-active text-dash-active-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
        >
            <Icon className="size-4 shrink-0" strokeWidth={1.6} />
            {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
            {!collapsed && item.status === "soon" && (
                <Badge variant="secondary" className="text-[0.6rem] font-normal text-muted-foreground">
                    Soon
                </Badge>
            )}
        </Link>
    );

    if (!collapsed) return link;

    return (
        <Tooltip>
            <TooltipTrigger render={link} />
            <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
    );
}
