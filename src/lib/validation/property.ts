import { z } from "zod";

export const agentSchema = z.object({
    name: z.string().trim().min(1, "Agent name is required."),
    title: z.string().trim().min(1, "Agent title is required."),
    phone: z.string().trim().min(1, "Agent phone is required."),
    email: z.string().trim().email("Enter a valid email address."),
});

export const propertyStatusValues = ["For Sale", "For Rent", "New", "Reserved", "Sold"] as const;

export const propertySchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters."),
    slug: z
        .string()
        .trim()
        .min(3, "Slug must be at least 3 characters.")
        .regex(/^[a-z0-9-]+$/i, "Use letters, numbers and hyphens only."),
    description: z.string().trim().min(20, "Description must be at least 20 characters."),
    propertyType: z.string().min(1, "Select a property type."),
    transactionType: z.enum(["sale", "rent"]),
    location: z.string().min(1, "Select a location."),
    bedrooms: z.coerce.number().int().min(0),
    bathrooms: z.coerce.number().int().min(0),
    parking: z.coerce.number().int().min(0),
    area: z.coerce.number().min(0),
    landSize: z.coerce.number().min(0).optional(),
    price: z.coerce.number().min(0, "Price must be zero or greater."),
    currency: z.string().trim().min(1, "Currency is required."),
    features: z.array(z.string().trim().min(1)).default([]),
    amenities: z.array(z.string().trim().min(1)).default([]),
    images: z.array(z.string().trim().min(1)).min(1, "Add at least one image."),
    status: z.enum(propertyStatusValues),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    agent: agentSchema,
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export const propertyFormDefaults: PropertyFormValues = {
    title: "",
    slug: "",
    description: "",
    propertyType: "",
    transactionType: "sale",
    location: "",
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    area: 0,
    landSize: undefined,
    price: 0,
    currency: "KES",
    features: [],
    amenities: [],
    images: [],
    status: "For Sale",
    published: false,
    featured: false,
    agent: { name: "", title: "", phone: "", email: "" },
};
