"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { submitLeadAction, type LeadFormState } from "@/app/(site)/lead-actions";
import { Field, TextArea, TextInput } from "./ui";

type LeadFormType = "viewing" | "info" | "general" | "sell" | "valuation" | "consultation";

interface LeadFormProps {
    type?: LeadFormType;
    subject?: string;
    propertyId?: string;
    propertySlug?: string;
}

const copy: Record<
    LeadFormType,
    { submitLabel: string; pendingLabel: string; success: string; defaultSubject: string }
> = {
    viewing: {
        submitLabel: "Request a Viewing",
        pendingLabel: "Sending…",
        success: "Thank you. Your consultant will confirm a viewing time shortly.",
        defaultSubject: "Property Viewing",
    },
    info: {
        submitLabel: "Request Information",
        pendingLabel: "Sending…",
        success: "Thank you. Property information is on its way to your inbox.",
        defaultSubject: "Property Information Request",
    },
    general: {
        submitLabel: "Send Enquiry",
        pendingLabel: "Sending…",
        success: "Thank you for your enquiry. Our team will be in touch shortly.",
        defaultSubject: "General Enquiry",
    },
    sell: {
        submitLabel: "Speak to a Consultant",
        pendingLabel: "Sending…",
        success: "Thank you. A consultant will be in touch to discuss selling your property.",
        defaultSubject: "Selling a Property",
    },
    valuation: {
        submitLabel: "Request a Valuation",
        pendingLabel: "Sending…",
        success: "Thank you. We will be in touch to arrange your property valuation.",
        defaultSubject: "Property Valuation",
    },
    consultation: {
        submitLabel: "Book a Consultation",
        pendingLabel: "Sending…",
        success: "Thank you. A consultant will respond within one business day.",
        defaultSubject: "Consultation",
    },
};

function SubmitButton({ type }: { type: LeadFormType }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="mt-2 bg-primary px-8 py-4 text-center text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {pending ? copy[type].pendingLabel : copy[type].submitLabel}
        </button>
    );
}

export function LeadForm({ type = "general", subject, propertyId, propertySlug }: LeadFormProps) {
    const [state, formAction] = useActionState<LeadFormState, FormData>(submitLeadAction, undefined);
    const [renderedAt] = useState(() => Date.now());
    const effectiveSubject = subject ? `${copy[type].defaultSubject} — ${subject}` : copy[type].defaultSubject;

    if (state?.success) {
        return (
            <div className="border border-border bg-background p-8">
                <p className="font-serif text-2xl text-foreground">Enquiry received.</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {copy[type].success}
                </p>
            </div>
        );
    }

    return (
        <form action={formAction} className="grid gap-5 border border-border bg-background p-8">
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="subject" value={effectiveSubject} />
            {propertyId && <input type="hidden" name="propertyId" value={propertyId} />}
            {propertySlug && <input type="hidden" name="propertySlug" value={propertySlug} />}
            <input type="hidden" name="renderedAt" value={renderedAt} />

            {/* Honeypot — hidden from real visitors, left empty by them, filled in by bots. Name/label
               are deliberately unremarkable so they don't match browser autofill heuristics or read
               as a trap to anything scraping the raw HTML. */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="refCode">Reference code</label>
                <input id="refCode" name="refCode" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            {state?.error ? (
                <p className="border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                    {state.error}
                </p>
            ) : null}

            <Field label="Full name">
                <TextInput name="name" required autoComplete="name" placeholder="Jane Doe" />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email">
                    <TextInput
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="jane@email.com"
                    />
                </Field>

                <Field label="Phone">
                    <TextInput
                        type="tel"
                        name="phone"
                        required
                        autoComplete="tel"
                        placeholder="+254 7XX XXX XXX"
                    />
                </Field>
            </div>

            <Field label="Message">
                <TextArea
                    name="message"
                    placeholder={
                        subject
                            ? `I'm interested in ${subject}...`
                            : "Tell us what you're looking for..."
                    }
                />
            </Field>

            <SubmitButton type={type} />
        </form>
    );
}
