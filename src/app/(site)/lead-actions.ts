"use server";

import type { LeadCategory, LeadFormType } from "@/lib/types";
import { createLead } from "@/lib/firebase/leads";
import { leadSubmissionSchema } from "@/lib/validation/lead";

export type LeadFormState = { error?: string; success?: boolean } | undefined;

const CATEGORY_BY_FORM_TYPE: Record<LeadFormType, LeadCategory> = {
    viewing: "viewing",
    sell: "consultation",
    valuation: "consultation",
    consultation: "consultation",
    info: "inquiry",
    general: "inquiry",
};

const MIN_SUBMIT_MS = 1500;

export async function submitLeadAction(_prevState: LeadFormState, formData: FormData): Promise<LeadFormState> {
    const parsed = leadSubmissionSchema.safeParse({
        type: formData.get("type"),
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
        subject: formData.get("subject") || undefined,
        propertyId: formData.get("propertyId") || undefined,
        propertySlug: formData.get("propertySlug") || undefined,
        refCode: formData.get("refCode") || undefined,
        renderedAt: formData.get("renderedAt") || undefined,
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
    }

    const { type, refCode, renderedAt, ...rest } = parsed.data;

    // Honeypot tripped, or submitted faster than a human could fill the form: pretend success
    // so bots don't learn either check exists.
    const submittedTooFast = renderedAt !== undefined && Date.now() - renderedAt < MIN_SUBMIT_MS;
    if (refCode || submittedTooFast) return { success: true };

    await createLead({
        category: CATEGORY_BY_FORM_TYPE[type],
        formType: type,
        ...rest,
    });

    return { success: true };
}
