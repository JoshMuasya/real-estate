import "dotenv/config";

import { adminDb } from "@/lib/firebase/admin";

interface SeedArticle {
    id: string;
    slug: string;
    title: string;
    category: string;
    readingTime: string;
    excerpt: string;
    image: string;
    featured: boolean;
    body: string[];
}

const seedArticles: SeedArticle[] = [
    {
        id: "in-001",
        slug: "buying-property-in-kenya-a-considered-approach",
        title: "Buying Property in Kenya: A Considered Approach",
        category: "Buying",
        readingTime: "6 min read",
        excerpt:
            "From title verification to due diligence and completion, a measured look at the steps that protect a property purchase.",
        image: "/insight-1.jpg",
        featured: true,
        body: [
            "A property purchase rewards patience. Before price is discussed, the fundamentals should be established: who holds the title, what the title permits, and whether the physical property matches the paperwork.",
            "Verification begins at the lands registry. An official search confirms ownership, encumbrances and any caveats registered against the parcel. Where a property sits within a scheme, the mother title and the sectional plan should both be reviewed.",
            "Due diligence extends beyond documents. Site visits at different times of day reveal access, drainage, noise and neighbouring development that photographs rarely convey. Where a development is ongoing, the track record of the developer matters as much as the specification sheet.",
            "Finally, structure the transaction properly. A sale agreement drawn by a competent conveyancer, funds held in a client account, and a clear completion schedule turn a significant decision into a straightforward one.",
        ],
    },
    {
        id: "in-002",
        slug: "reading-the-market-where-growth-is-forming",
        title: "Reading the Market: Where Growth Is Forming",
        category: "Market Trends",
        readingTime: "5 min read",
        excerpt:
            "Infrastructure, employment and land supply shape value long before prices move. How to read the signals early.",
        image: "/insight-2.jpg",
        featured: false,
        body: [
            "Property values follow access. New roads, bypasses and utility corridors change travel times, and travel times change where people are willing to live and work.",
            "Employment clusters are the second signal. Where offices, logistics parks and institutions locate, sustained rental demand tends to follow within a few years.",
            "Land supply completes the picture. Areas with constrained developable land respond differently to demand than areas where supply can expand quickly, and the difference shows up in long-term pricing behaviour.",
            "None of these signals is decisive alone. Read together, and tested on the ground, they help investors position ahead of the market rather than behind it.",
        ],
    },
    {
        id: "in-003",
        slug: "diaspora-investment-buying-well-from-abroad",
        title: "Diaspora Investment: Buying Well From Abroad",
        category: "Diaspora",
        readingTime: "7 min read",
        excerpt:
            "Distance changes the process, not the standards. Practical structures for buying and managing property remotely.",
        image: "/insight-3.jpg",
        featured: true,
        body: [
            "Buying from abroad requires a representative you can hold accountable. A written scope of work, agreed reporting intervals and documented site visits replace the reassurance of being present.",
            "Payment discipline is essential. Funds should move against verified documents and defined milestones, never against verbal assurance.",
            "Management should be arranged before completion, not after. A property that sits vacant while arrangements are made loses income and condition at the same time.",
            "Handled properly, distance is a logistical matter rather than a risk. The standards applied are the same standards applied to any considered purchase.",
        ],
    },
];

async function main() {
    const db = adminDb();
    const collection = db.collection("articles");
    const now = new Date();
    let queued = 0;

    const batch = db.batch();

    for (const { id, ...article } of seedArticles) {
        const ref = collection.doc(id);
        const existing = await ref.get();

        if (existing.exists) {
            console.log(`Skipping ${id} (${article.slug}) — already exists.`);
            continue;
        }

        batch.set(ref, { ...article, published: true, createdAt: now, updatedAt: now });
        queued += 1;
        console.log(`Queued ${id} (${article.slug}).`);
    }

    if (queued > 0) {
        await batch.commit();
    }

    console.log(`Done — ${queued} article${queued === 1 ? "" : "s"} written.`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
