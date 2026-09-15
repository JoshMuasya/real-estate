import type { Metadata } from "next";

import { PageHeader } from "@/components/site/PageHeader";
import { LeadForm } from "@/components/site/LeadForm";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = {
    title: "Sell Your Property | Loymax Properties",
    description:
        "Position your property in front of the right buyers with a professional marketing and sales strategy designed to maximise its value.",
    openGraph: {
        title: "Sell Your Property | Loymax Properties",
        description:
            "Professional representation and strategic marketing for property owners.",
    },
};

const steps = [
    {
        title: "Valuation",
        body: "A grounded assessment of what your property is worth today, and what influences that figure.",
    },
    {
        title: "Preparation",
        body: "Presentation, photography and documentation prepared before the property reaches the market.",
    },
    {
        title: "Marketing",
        body: "Targeted exposure to qualified buyers rather than indiscriminate listing.",
    },
    {
        title: "Negotiation",
        body: "Offers assessed on price, certainty and timing — then negotiated on your behalf.",
    },
    {
        title: "Completion",
        body: "Coordinated conveyancing and handover, with clear reporting at every stage.",
    },
];

export default function SellPage() {
    return (
        <>
            <PageHeader
                eyebrow="Sell With Us"
                title="Thinking of Selling Your Property?"
                description="Position your property in front of the right buyers with a professional marketing and sales strategy designed to maximise its value."
            />

            <section className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 lg:py-28">
                <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
                    {/* Sales Process */}
                    <div>
                        <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl">
                            How a sale is handled.
                        </h2>

                        <ol className="mt-12">
                            {steps.map((step, index) => (
                                <Reveal
                                    as="li"
                                    key={step.title}
                                    delay={index * 60}
                                    className="flex gap-8 border-t border-border py-7"
                                >
                                    <span className="font-serif text-2xl text-brand">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <div>
                                        <h3 className="font-serif text-2xl text-foreground">
                                            {step.title}
                                        </h3>

                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                            {step.body}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </ol>
                    </div>

                    {/* Lead Form */}
                    <div>
                        <LeadForm type="sell" />

                        <div className="mt-8 border border-brand/40 bg-background p-8">
                            <h3 className="font-serif text-2xl text-foreground">
                                Request a Property Valuation
                            </h3>

                            <p className="mt-3 text-sm text-muted-foreground">
                                Prefer to start with a figure? Ask for a valuation and we
                                will assess your property before any commitment.
                            </p>

                            <a
                                href="#valuation"
                                className="mt-6 inline-block border border-brand px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-brand transition-colors hover:bg-brand hover:text-brand-foreground"
                            >
                                Request a Valuation
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Valuation */}
            <section
                id="valuation"
                className="border-t border-border bg-background py-20 lg:py-28"
            >
                <div className="mx-auto grid max-w-[88rem] gap-12 px-6 lg:grid-cols-2 lg:px-10">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                            Valuation
                        </p>

                        <h2 className="mt-5 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
                            What is your property worth?
                        </h2>

                        <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
                            We assess comparable evidence, condition, location and current
                            demand to arrive at a realistic figure — not an inflated one.
                        </p>
                    </div>

                    <LeadForm type="valuation" />
                </div>
            </section>
        </>
    );
}