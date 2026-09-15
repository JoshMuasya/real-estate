import "dotenv/config";

import { adminDb } from "@/lib/firebase/admin";

interface SeedTestimonial {
    id: string;
    name: string;
    role: string;
    quote: string;
}

const seedTestimonials: SeedTestimonial[] = [
    {
        id: "te-001",
        name: "Achieng' Odera",
        role: "Homeowner, Nairobi",
        quote:
            "They understood what we were looking for after one conversation, and never showed us a property that wasted our time. The whole process felt considered.",
    },
    {
        id: "te-002",
        name: "Peter Mwangi",
        role: "Investor, Kiambu",
        quote:
            "The advice was honest, including when it meant telling me not to buy. That is why I have returned three times since.",
    },
    {
        id: "te-003",
        name: "Njeri Kamau",
        role: "Diaspora Client, London",
        quote:
            "Buying from abroad is daunting. Loymax documented every step, and I felt informed at all times without having to chase anyone.",
    },
];

async function main() {
    const db = adminDb();
    const collection = db.collection("testimonials");
    const now = new Date();
    let queued = 0;

    const batch = db.batch();

    for (const { id, ...testimonial } of seedTestimonials) {
        const ref = collection.doc(id);
        const existing = await ref.get();

        if (existing.exists) {
            console.log(`Skipping ${id} (${testimonial.name}) — already exists.`);
            continue;
        }

        batch.set(ref, { ...testimonial, published: true, createdAt: now, updatedAt: now });
        queued += 1;
        console.log(`Queued ${id} (${testimonial.name}).`);
    }

    if (queued > 0) {
        await batch.commit();
    }

    console.log(`Done — ${queued} testimonial${queued === 1 ? "" : "s"} written.`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
