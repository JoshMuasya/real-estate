import { z } from "zod";

export const articleSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters."),
    slug: z
        .string()
        .trim()
        .min(3, "Slug must be at least 3 characters.")
        .regex(/^[a-z0-9-]+$/i, "Use letters, numbers and hyphens only."),
    category: z.string().trim().min(1, "Category is required."),
    excerpt: z.string().trim().min(20, "Excerpt must be at least 20 characters."),
    image: z.string().trim().min(1, "Add a hero image."),
    body: z.string().trim().min(20, "Body must be at least 20 characters."),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;

export const articleFormDefaults: ArticleFormValues = {
    title: "",
    slug: "",
    category: "",
    excerpt: "",
    image: "",
    body: "",
    published: false,
    featured: false,
};
