"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Menu, Settings, UserRound } from "lucide-react";

import { logoutAction } from "@/lib/auth/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SessionUser } from "@/lib/types";
import { NAV_SECTIONS } from "./NavConfig";

const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items).sort(
    (a, b) => b.href.length - a.href.length,
);

function pageTitleFor(pathname: string): string {
    const match = ALL_NAV_ITEMS.find((item) =>
        item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href),
    );
    return match?.label ?? "Dashboard";
}

function initials(name?: string, email?: string): string {
    const source = name?.trim() || email || "";
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return source.slice(0, 2).toUpperCase() || "U";
}

export function TopBar({ user, onMobileMenuClick }: { user: SessionUser; onMobileMenuClick: () => void }) {
    const pathname = usePathname();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 lg:px-8">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="lg:hidden"
                    aria-label="Open navigation"
                    onClick={onMobileMenuClick}
                >
                    <Menu className="size-5" />
                </Button>
                <h1 className="font-serif text-lg text-foreground">{pageTitleFor(pathname)}</h1>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 rounded-full py-1 pr-1 pl-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 lg:pl-3">
                    <span className="hidden text-right lg:block">
                        <span className="block text-sm font-medium leading-tight text-foreground">
                            {user.name || user.email}
                        </span>
                        <span className="block text-xs capitalize leading-tight text-muted-foreground">
                            {user.role}
                        </span>
                    </span>
                    <span className="flex size-9 items-center justify-center rounded-full bg-dash-active text-sm font-medium text-dash-active-foreground">
                        {initials(user.name, user.email)}
                    </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                        <p className="truncate text-sm font-medium text-foreground">{user.name || "Team member"}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        <Badge variant="secondary" className="mt-2 capitalize">
                            {user.role}
                        </Badge>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                        <UserRound className="size-4" />
                        My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                        <Settings className="size-4" />
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <form action={logoutAction}>
                        <DropdownMenuItem variant="destructive" render={<button type="submit" className="w-full" />}>
                            <LogOut className="size-4" />
                            Log out
                        </DropdownMenuItem>
                    </form>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
