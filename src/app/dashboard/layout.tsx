import type { Metadata } from "next";

import { verifySession } from "@/lib/auth/dal";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
    title: {
        default: "Dashboard",
        template: "%s | Loymax Dashboard",
    },
    robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await verifySession();

    return <DashboardShell user={user}>{children}</DashboardShell>;
}
