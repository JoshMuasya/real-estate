import type { Metadata } from "next";

import { verifyRole } from "@/lib/auth/dal";
import { getAllLocations } from "@/lib/firebase/locations";
import { LocationsClient } from "@/components/dashboard/LocationsClient";

export const metadata: Metadata = {
    title: "Featured Locations",
    description: "Manage featured locations shown on the website.",
};

export default async function LocationsPage() {
    await verifyRole("admin");
    const items = await getAllLocations();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-foreground">Featured Locations</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {items.length} location{items.length === 1 ? "" : "s"} on record
                </p>
            </div>
            <LocationsClient items={items} />
        </div>
    );
}
