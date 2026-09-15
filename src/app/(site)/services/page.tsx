import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Compass, Key, Search, ShieldCheck, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/ui";

export const metadata: Metadata = {
    title: {
        absolute: "Property Services in Kenya | Loymax Properties",
    },
    description:
        "Sales, acquisition, letting, advisory, management and development — full-service property consultancy for buyers, sellers, landlords and investors across Kenya.",
    openGraph: {
        title: "Property Services in Kenya | Loymax Properties",
        description:
            "A full-service property consultancy for buyers, sellers, landlords and investors.",
    },
};

const serviceOfferings = [
    {
        icon: Building2,
        title: "Property Sales",
        description:
            "Professional representation and strategic marketing for property owners, from valuation to close.",
        features: [
            "Comparable-based valuation",
            "Professional photography and listing",
            "Qualified buyer screening",
            "Negotiation and closing support",
        ],
    },
    {
        icon: Search,
        title: "Property Acquisition",
        description:
            "Independent guidance for buyers, from the first search to the final signature.",
        features: [
            "Needs and budget assessment",
            "A curated shortlist of matching properties",
            "Due diligence coordination",
            "Offer negotiation on your behalf",
        ],
    },
    {
        icon: Key,
        title: "Property Letting",
        description:
            "Professional support for landlords and tenants throughout the rental process.",
        features: [
            "Tenant sourcing and screening",
            "Lease preparation and signing",
            "Rent collection coordination",
            "Move-in and move-out inspections",
        ],
    },
    {
        icon: Compass,
        title: "Property Advisory",
        description:
            "Insight-driven guidance for important property decisions — before you commit.",
        features: [
            "Market and pricing insight",
            "Portfolio and holding review",
            "Buy, hold or sell analysis",
            "Independent second opinions",
        ],
    },
    {
        icon: ShieldCheck,
        title: "Property Management",
        description:
            "Solutions designed to protect and enhance property value over time.",
        features: [
            "Maintenance coordination",
            "Tenant relations",
            "Financial reporting",
            "Compliance oversight",
        ],
    },
    {
        icon: TrendingUp,
        title: "Development & Investment",
        description:
            "Identifying promising real estate development and investment opportunities.",
        features: [
            "Site and feasibility assessment",
            "Investment criteria screening",
            "Developer partnerships",
            "Access to off-plan opportunities",
        ],
    },
];

const process = [
    {
        title: "Consultation",
        body: "We start by understanding the outcome you want, not just the transaction in front of you.",
    },
    {
        title: "Strategy",
        body: "A plan tailored to your objective — sale, purchase, letting, management or investment.",
    },
    {
        title: "Execution",
        body: "Marketing, negotiation, paperwork and coordination handled to a professional standard.",
    },
    {
        title: "Ongoing Support",
        body: "The relationship continues after signing, from management to future opportunities.",
    },
];

export default function ServicesPage() {
    return (
        <>
            <PageHeader
                eyebrow="Services"
                title="A Full-Service Property Consultancy."
                description="Whether you are buying, selling, letting, managing or investing, every engagement is built around clear advice, careful execution and long-term value."
            />

            {/* Services */}
            <section className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 lg:py-28">
                <div className="grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
                    {serviceOfferings.map((service, index) => (
                        <Reveal
                            key={service.title}
                            delay={index * 50}
                            className="bg-background p-10 lg:p-12"
                        >
                            <service.icon
                                className="h-8 w-8 text-primary"
                                strokeWidth={1.4}
                                aria-hidden="true"
                            />

                            <h2 className="mt-8 font-serif text-2xl text-foreground">
                                {service.title}
                            </h2>

                            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                                {service.description}
                            </p>

                            <ul className="mt-6 space-y-3">
                                {service.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex gap-3 border-b border-border pb-3 text-sm text-foreground"
                                    >
                                        <span className="mt-2 h-px w-4 shrink-0 bg-brand" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Process */}
            <section className="border-y border-border bg-background py-20 lg:py-28">
                <div className="mx-auto max-w-[88rem] px-6 lg:px-10">
                    <Reveal>
                        <SectionHeading
                            eyebrow="How We Work"
                            title="One Process, Every Service."
                            description="The service changes with your objective. The standard of care does not."
                        />
                    </Reveal>

                    <ol className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                        {process.map((step, index) => (
                            <Reveal
                                as="li"
                                key={step.title}
                                delay={index * 60}
                                className="bg-background p-10"
                            >
                                <span className="font-serif text-3xl text-brand">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <h3 className="mt-6 font-serif text-xl text-foreground">
                                    {step.title}
                                </h3>

                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                    {step.body}
                                </p>
                            </Reveal>
                        ))}
                    </ol>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 lg:py-28">
                <div className="mx-auto max-w-[88rem] px-6 text-center lg:px-10">
                    <h2 className="mx-auto max-w-2xl font-serif text-4xl tracking-tight text-foreground md:text-5xl">
                        Ready to start the conversation?
                    </h2>

                    <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                        Tell us what you are trying to achieve, and a Loymax consultant will
                        recommend the right service for your situation.
                    </p>

                    <Link
                        href="/contact"
                        className="mt-10 inline-block bg-primary px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85"
                    >
                        Book a Consultation
                    </Link>
                </div>
            </section>
        </>
    );
}
