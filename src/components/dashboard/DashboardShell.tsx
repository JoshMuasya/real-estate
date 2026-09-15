"use client";

import { useState } from "react";

import type { SessionUser } from "@/lib/types";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function DashboardShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-muted/30">
            <Sidebar role={user.role} mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen} />
            <div className="flex min-w-0 flex-1 flex-col">
                <TopBar user={user} onMobileMenuClick={() => setMobileOpen(true)} />
                <main className="flex-1 p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
