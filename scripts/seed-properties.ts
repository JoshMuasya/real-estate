import "dotenv/config";

import { adminDb } from "@/lib/firebase/admin";
import { seedProperties } from "./seed-properties.data";

async function main() {
    const db = adminDb();
    const collection = db.collection("properties");
    const now = new Date();
    let queued = 0;

    const batch = db.batch();

    for (const { id, ...property } of seedProperties) {
        const ref = collection.doc(id);
        const existing = await ref.get();

        if (existing.exists) {
            console.log(`Skipping ${id} (${property.slug}) — already exists.`);
            continue;
        }

        batch.set(ref, { ...property, createdAt: now, updatedAt: now });
        queued += 1;
        console.log(`Queued ${id} (${property.slug}).`);
    }

    if (queued > 0) {
        await batch.commit();
    }

    console.log(`Done — ${queued} propert${queued === 1 ? "y" : "ies"} written.`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
