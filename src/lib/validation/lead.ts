import { z } from "zod";

export const leadFormTypeValues = ["viewing", "info", "general", "sell", "valuation", "consultation"] as const;

export const leadSubmissionSchema = z.object({
    type: z.enum(leadFormTypeValues),
    name: z.string().trim().min(1, "Name is required."),
    email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
    phone: z.string().trim().min(1, "Phone number is required."),
    message: z.string().trim().optional().default(""),
    subject: z.string().trim().optional(),
    propertyId: z.string().trim().optional(),
    propertySlug: z.string().trim().optional(),
    // Honeypot: hidden from real visitors via CSS; a filled value marks the submission as spam.
    refCode: z.string().optional(),
    // Timestamp (ms) captured when the form mounted; a submission faster than a human can type is spam.
    renderedAt: z.coerce.number().optional(),
});

export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;
