import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";

import { companyStats, differentiators } from "@/lib/data/site";
import { getPublishedTestimonials } from "@/lib/firebase/testimonials";

const values = [
    {
        title: "Professionalism",
        body: "Clear process, careful documentation, considered advice.",
    },
    {
        title: "Integrity",
        body: "We say what we believe, including when it costs us a transaction.",
    },
    {
        title: "Market Knowledge",
        body: "Judgement built on years of transactions, not headlines.",
    },
    {
        title: "Client Relationships",
        body: "Most of our work comes from people we have advised before.",
    },
    {
        title: "Long-Term Value",
        body: "We advise on decisions that hold up over a decade.",
    },
];

export default async function AboutPage() {
    const testimonials = await getPublishedTestimonials();

    return (
        <>
            <PageHeader
                eyebrow="About"
                title="Built Around Trust. Driven by Property."
                description="Loymax Properties was founded on a simple idea: property decisions are consequential, and people deserve advice that treats them that way."
            />

            {/* Introduction */}
            <section className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 lg:py-28">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    <Reveal className="overflow-hidden">
                        <Image
                            src="/about.jpg"
                            alt="Loymax consultants reviewing property plans"
                            width={1200}
                            height={1400}
                            className="h-full w-full object-cover"
                            priority
                        />
                    </Reveal>

                    <Reveal delay={80}>
                        <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl">
                            A consultancy, not a listing service.
                        </h2>

                        <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
                            We represent buyers, sellers, landlords and investors across
                            Kenya — from family homes in Nairobi&apos;s established suburbs
                            to coastal residences, commercial floors and land holdings
                            positioned for development.
                        </p>

                        <p className="mt-5 leading-relaxed text-muted-foreground">
                            Our work begins with understanding the decision you are trying
                            to make. Only then do we talk about property. That order rarely
                            changes, and it is the reason clients return.
                        </p>

                        <ul className="mt-10">
                            {values.map((value) => (
                                <li
                                    key={value.title}
                                    className="border-t border-border py-5"
                                >
                                    <h3 className="font-serif text-xl text-foreground">
                                        {value.title}
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {value.body}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            {/* Company Stats */}
            <section className="bg-primary py-20 text-primary-foreground lg:py-24">
                <div className="mx-auto grid max-w-[88rem] grid-cols-2 gap-12 px-6 lg:grid-cols-4 lg:px-10">
                    {companyStats.map((stat, index) => (
                        <Reveal key={stat.label} delay={index * 60}>
                            <p className="font-serif text-5xl md:text-6xl">
                                {stat.value}
                            </p>

                            <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
                                {stat.label}
                            </p>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Differentiators */}
            <section className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 lg:py-28">
                <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl">
                    Confidence in Every Property Decision.
                </h2>

                <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
                    {differentiators.map((item, index) => (
                        <Reveal
                            key={item.title}
                            delay={index * 50}
                            className="bg-background p-10"
                        >
                            <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <h3 className="mt-6 font-serif text-2xl text-foreground">
                                {item.title}
                            </h3>

                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                {item.description}
                            </p>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="border-t border-border bg-background py-20 lg:py-28">
                <div className="mx-auto max-w-[88rem] px-6 lg:px-10">
                    <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl">
                        Trusted by Our Clients.
                    </h2>

                    <div className="mt-14 grid gap-8 md:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <Reveal
                                key={testimonial.name}
                                delay={index * 70}
                                className="border border-border p-10"
                            >
                                <span className="font-serif text-4xl text-brand">
                                    &ldquo;
                                </span>

                                <p className="mt-4 leading-relaxed text-foreground">
                                    {testimonial.quote}
                                </p>

                                <p className="mt-8 font-serif text-lg text-primary">
                                    {testimonial.name}
                                </p>

                                <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                    {testimonial.role}
                                </p>
                            </Reveal>
                        ))}
                    </div>

                    <Link
                        href="/contact"
                        className="mt-16 inline-block bg-primary px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85"
                    >
                        Book a Consultation
                    </Link>
                </div>
            </section>
        </>
    );
}