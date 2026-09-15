/**
 * Frozen snapshot of the original static mock properties (formerly
 * src/lib/data/properties.ts). Used only by scripts/seed-properties.ts to
 * migrate the public site's existing content into Firestore, preserving the
 * same ids/slugs/images so nothing changes for visitors post-migration.
 */

export interface SeedAgent {
    name: string;
    title: string;
    phone: string;
    email: string;
}

export interface SeedProperty {
    id: string;
    title: string;
    slug: string;
    location: string;
    propertyType: string;
    transactionType: "sale" | "rent";
    price: number;
    currency: string;
    bedrooms: number;
    bathrooms: number;
    parking: number;
    area: number;
    landSize?: number;
    description: string;
    features: string[];
    amenities: string[];
    images: string[];
    status: "For Sale" | "For Rent" | "New" | "Reserved" | "Sold";
    featured: boolean;
    published: boolean;
    agent: SeedAgent;
}

const property1 = "/property-1.jpg";
const property2 = "/property-2.jpg";
const property3 = "/property-3.jpg";
const property4 = "/property-4.jpg";
const property5 = "/property-5.jpg";
const property6 = "/property-6.jpg";

const defaultAgent: SeedAgent = {
    name: "Wanjiru Mathenge",
    title: "Senior Property Consultant",
    phone: "+254 700 000 000",
    email: "consult@loymaxproperties.co.ke",
};

const secondAgent: SeedAgent = {
    name: "Daniel Otieno",
    title: "Head of Commercial & Investment",
    phone: "+254 700 000 111",
    email: "commercial@loymaxproperties.co.ke",
};

export const seedProperties: SeedProperty[] = [
    {
        id: "lp-001",
        title: "Karen Ridge Residence",
        slug: "karen-ridge-residence",
        location: "Nairobi",
        propertyType: "Villa",
        transactionType: "sale",
        price: 185000000,
        currency: "KES",
        bedrooms: 5,
        bathrooms: 6,
        parking: 4,
        area: 620,
        landSize: 4046,
        description:
            "A restrained, architect-led family residence set behind mature indigenous landscaping in Karen. Living volumes open fully to a north-facing terrace, while a separate guest pavilion offers privacy for visiting family.",
        features: [
            "Double-volume living room",
            "Chef's kitchen with pantry",
            "Guest pavilion",
            "Solar water heating",
            "Underfloor heating to principal suite",
        ],
        amenities: ["Swimming Pool", "Garden", "24/7 Security", "Borehole", "Staff Quarters"],
        images: [property1, property2, property5],
        status: "For Sale",
        featured: true,
        published: true,
        agent: defaultAgent,
    },
    {
        id: "lp-002",
        title: "Westlands Skyline Penthouse",
        slug: "westlands-skyline-penthouse",
        location: "Nairobi",
        propertyType: "Penthouse",
        transactionType: "sale",
        price: 96000000,
        currency: "KES",
        bedrooms: 4,
        bathrooms: 4,
        parking: 3,
        area: 385,
        description:
            "A full-floor penthouse with uninterrupted views across the Nairobi skyline. Interiors are finished in oak, plaster and stone, with a wrap-around terrace designed for evening entertaining.",
        features: [
            "Full-floor plate",
            "Private lift lobby",
            "Wrap-around terrace",
            "Smart home controls",
        ],
        amenities: ["Gym", "Lift", "24/7 Security", "Backup Generator", "Swimming Pool"],
        images: [property2, property1, property4],
        status: "New",
        featured: true,
        published: true,
        agent: defaultAgent,
    },
    {
        id: "lp-003",
        title: "Nyali Oceanfront Villa",
        slug: "nyali-oceanfront-villa",
        location: "Mombasa",
        propertyType: "Villa",
        transactionType: "sale",
        price: 142000000,
        currency: "KES",
        bedrooms: 5,
        bathrooms: 5,
        parking: 3,
        area: 540,
        landSize: 2023,
        description:
            "A coastal residence with direct beach access, white plaster walls and deep shaded verandas that trace the sea breeze through the plan.",
        features: ["Direct beach access", "Makuti-shaded terrace", "Outdoor shower", "Guest wing"],
        amenities: ["Swimming Pool", "Garden", "24/7 Security", "Staff Quarters"],
        images: [property3, property1, property2],
        status: "For Sale",
        featured: true,
        published: true,
        agent: defaultAgent,
    },
    {
        id: "lp-004",
        title: "Upper Hill Commercial Floors",
        slug: "upper-hill-commercial-floors",
        location: "Nairobi",
        propertyType: "Commercial",
        transactionType: "rent",
        price: 1450000,
        currency: "KES",
        bedrooms: 0,
        bathrooms: 4,
        parking: 20,
        area: 900,
        description:
            "Grade-A office floors in Upper Hill with efficient floor plates, dedicated lift cores and generous parking ratios. Suitable for corporate headquarters or regional offices.",
        features: ["Grade-A specification", "Raised floors", "Fibre-ready", "Dedicated lift core"],
        amenities: ["Lift", "24/7 Security", "Backup Generator"],
        images: [property4, property2],
        status: "For Rent",
        featured: false,
        published: true,
        agent: secondAgent,
    },
    {
        id: "lp-005",
        title: "Naivasha Lakeside Estate",
        slug: "naivasha-lakeside-estate",
        location: "Naivasha",
        propertyType: "Villa",
        transactionType: "sale",
        price: 78000000,
        currency: "KES",
        bedrooms: 4,
        bathrooms: 4,
        parking: 4,
        area: 430,
        landSize: 8094,
        description:
            "A country estate on two acres of lawn running to the lake edge, with fever trees, a stone terrace and a separate cottage for guests or short-stay letting.",
        features: ["Two-acre grounds", "Guest cottage", "Stone fireplace", "Rainwater harvesting"],
        amenities: ["Garden", "Borehole", "24/7 Security", "Staff Quarters"],
        images: [property5, property1],
        status: "Reserved",
        featured: true,
        published: true,
        agent: defaultAgent,
    },
    {
        id: "lp-006",
        title: "Runda Courtyard Townhouses",
        slug: "runda-courtyard-townhouses",
        location: "Nairobi",
        propertyType: "Townhouse",
        transactionType: "rent",
        price: 480000,
        currency: "KES",
        bedrooms: 4,
        bathrooms: 4,
        parking: 2,
        area: 310,
        description:
            "A small gated scheme of contemporary townhouses arranged around a planted courtyard, finished in charcoal cladding and warm timber.",
        features: ["Gated scheme of eight", "Private courtyard", "Fitted kitchen", "DSQ"],
        amenities: ["Garden", "24/7 Security", "Backup Generator", "Gym"],
        images: [property6, property2],
        status: "For Rent",
        featured: true,
        published: true,
        agent: defaultAgent,
    },
    {
        id: "lp-007",
        title: "Tigoni Highland Retreat",
        slug: "tigoni-highland-retreat",
        location: "Kiambu",
        propertyType: "Villa",
        transactionType: "sale",
        price: 64000000,
        currency: "KES",
        bedrooms: 4,
        bathrooms: 3,
        parking: 3,
        area: 360,
        landSize: 6070,
        description:
            "A highland home bordering tea farms in Tigoni, with cool mornings, long views and generous grounds ready for further development.",
        features: ["Tea-farm frontage", "Fireplace", "Detached studio", "Orchard"],
        amenities: ["Garden", "Borehole", "24/7 Security"],
        images: [property1, property5],
        status: "For Sale",
        featured: false,
        published: true,
        agent: defaultAgent,
    },
    {
        id: "lp-008",
        title: "Kitengela Development Land",
        slug: "kitengela-development-land",
        location: "Kajiado",
        propertyType: "Land",
        transactionType: "sale",
        price: 42000000,
        currency: "KES",
        bedrooms: 0,
        bathrooms: 0,
        parking: 0,
        area: 0,
        landSize: 20234,
        description:
            "Five acres of level, titled land on a tarmac frontage in Kitengela — well positioned for phased residential development or light industrial use.",
        features: ["Freehold title", "Tarmac frontage", "Level topography", "Mains power adjacent"],
        amenities: ["Borehole"],
        images: [property5, property6],
        status: "For Sale",
        featured: false,
        published: true,
        agent: secondAgent,
    },
    {
        id: "lp-009",
        title: "Kilimani Garden Apartment",
        slug: "kilimani-garden-apartment",
        location: "Nairobi",
        propertyType: "Apartment",
        transactionType: "rent",
        price: 215000,
        currency: "KES",
        bedrooms: 3,
        bathrooms: 3,
        parking: 2,
        area: 195,
        description:
            "A quiet ground-floor apartment with a private planted terrace, set within a low-density Kilimani development of only twelve units.",
        features: ["Private terrace", "Twelve-unit development", "Fitted wardrobes"],
        amenities: ["Swimming Pool", "Gym", "Lift", "24/7 Security", "Backup Generator"],
        images: [property2, property6],
        status: "For Rent",
        featured: false,
        published: true,
        agent: defaultAgent,
    },
];
