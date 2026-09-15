import { z } from "zod";

export const locationSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),
    slug: z
        .string()
        .trim()
        .min(2, "Slug must be at least 2 characters.")
        .regex(/^[a-z0-9-]+$/i, "Use letters, numbers and hyphens only."),
    description: z.string().trim().min(10, "Description must be at least 10 characters."),
    image: z.string().trim().min(1, "Add an image."),
    published: z.boolean().default(false),
});

export type LocationFormValues = z.infer<typeof locationSchema>;

export const locationFormDefaults: LocationFormValues = {
    name: "",
    slug: "",
    description: "",
    image: "",
    published: false,
};
