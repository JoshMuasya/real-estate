import { z } from "zod";

export const testimonialSchema = z.object({
    name: z.string().trim().min(1, "Name is required."),
    role: z.string().trim().min(1, "Role is required."),
    quote: z.string().trim().min(1, "Quote is required."),
    published: z.boolean().default(false),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export const testimonialFormDefaults: TestimonialFormValues = {
    name: "",
    role: "",
    quote: "",
    published: false,
};
