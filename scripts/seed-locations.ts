import "dotenv/config";

import { adminDb } from "@/lib/firebase/admin";

interface SeedLocation {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
}

const seedLocations: SeedLocation[] = [
    {
        id: "lo-001",
        name: "Nairobi",
        slug: "nairobi",
        description:
            "Established suburbs, prime commercial addresses and a deep, liquid residential market.",
        image: "/loc-nairobi.jpg",
    },
    {
        id: "lo-002",
        name: "Kiambu",
        slug: "kiambu",
        description: "Highland homes and gated communities within reach of the city.",
        image: "/loc-kiambu.jpg",
    },
    {
        id: "lo-003",
        name: "Kajiado",
        slug: "kajiado",
        description: "Open land holdings and emerging residential corridors south of Nairobi.",
        image: "/loc-kajiado.jpg",
    },
    {
        id: "lo-004",
        name: "Mombasa",
        slug: "mombasa",
        description: "Coastal residences, holiday homes and steady short-stay rental demand.",
        image: "/loc-mombasa.jpg",
    },
    {
        id: "lo-005",
        name: "Naivasha",
        slug: "naivasha",
        description: "Lakeside estates and country retreats within a comfortable drive.",
        image: "/loc-naivasha.jpg",
    },
];

async function main() {
    const db = adminDb();
    const collection = db.collection("locations");
    const now = new Date();
    let queued = 0;

    const batch = db.batch();

    for (const { id, ...location } of seedLocations) {
        const ref = collection.doc(id);
        const existing = await ref.get();

        if (existing.exists) {
            console.log(`Skipping ${id} (${location.slug}) — already exists.`);
            continue;
        }

        batch.set(ref, { ...location, published: true, createdAt: now, updatedAt: now });
        queued += 1;
        console.log(`Queued ${id} (${location.slug}).`);
    }

    if (queued > 0) {
        await batch.commit();
    }

    console.log(`Done — ${queued} location${queued === 1 ? "" : "s"} written.`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
