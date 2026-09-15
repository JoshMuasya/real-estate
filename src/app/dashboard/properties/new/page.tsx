import type { Metadata } from "next";

import { verifyRole } from "@/lib/auth/dal";
import { NewPropertyClient } from "./NewPropertyClient";

export const metadata: Metadata = {
    title: "Add Property",
    description: "Create a new property listing.",
};

export default async function NewPropertyPage() {
    await verifyRole("admin", "agent");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-foreground">Add Property</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Fill in the details below. You can save as a draft and publish later.
                </p>
            </div>
            <NewPropertyClient />
        </div>
    );
}
