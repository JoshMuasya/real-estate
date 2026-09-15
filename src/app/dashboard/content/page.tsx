import type { Metadata } from "next";

import { verifyRole } from "@/lib/auth/dal";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata: Metadata = {
    title: "Website Content",
    description: "Manage website content and pages.",
};

export default async function WebsiteContentPage() {
    await verifyRole("admin");
    return <ComingSoon feature="Website Content" />;
}
