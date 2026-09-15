import type { Metadata } from "next";

import { verifyRole } from "@/lib/auth/dal";
import { NewLocationClient } from "./NewLocationClient";

export const metadata: Metadata = {
    title: "Add Location",
    description: "Create a new featured location.",
};

export default async function NewLocationPage() {
    await verifyRole("admin");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-foreground">Add Location</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Fill in the details below. You can save as a draft and publish later.
                </p>
            </div>
            <NewLocationClient />
        </div>
    );
}
