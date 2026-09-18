import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";


import { locations, propertyTypes } from "@/lib/data/properties";
import { getFeaturedPublishedProperties } from "@/lib/firebase/properties";
import { companyStats, differentiators, investmentCriteria, services } from "@/lib/data/site";
import { formatDate } from "@/lib/data/insights";
import { getFeaturedPublishedArticles } from "@/lib/firebase/articles";
import { getPublishedLocations } from "@/lib/firebase/locations";
import { getPublishedTestimonials } from "@/lib/firebase/testimonials";
import { PropertyCard } from "./site/PropertyCard";
import { Reveal } from "./site/Reveal";
import { fieldClass, SectionHeading } from "./site/ui";

export default async function HomePage() {
    const [featured, featuredLocations, testimonials, articles] = await Promise.all([
        getFeaturedPublishedProperties(3),
        getPublishedLocations(),
        getPublishedTestimonials(),
        getFeaturedPublishedArticles(3),
    ]);

    return (
        <>
            {/* Hero */}
            <section className="relative flex min-h-[100svh] items-end overflow-hidden">
                <Image
                    src="/hero.jpg"
                    alt="A contemporary luxury residence at dusk"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/45 to-foreground/40" />

                {/* pt keeps the copy clear of the fixed header on short viewports, where the
                    content outgrows the hero and stops being bottom-aligned. */}
                <div className="relative mx-auto w-full max-w-[88rem] px-6 pb-24 pt-28 lg:px-10 lg:pb-32 lg:pt-32">
                    <p className="mb-0 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
                        Loymax Properties
                    </p>

                    <h1 className="mt-6 max-w-4xl font-serif text-4xl leading-[0.95] tracking-tight text-primary-foreground sm:text-5xl md:text-7xl lg:text-8xl">
                        Exceptional Properties. Thoughtful Investments.
                    </h1>

                    <p className="mt-8 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
                        Discover distinguished homes, investment opportunities and
                        exceptional spaces curated by Loymax Properties.
                    </p>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                        <Link
                            href="/properties"
                            className="inline-flex w-full items-center justify-center bg-primary px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85 sm:w-auto"
                        >
                            Explore Properties
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex w-full items-center justify-center border border-primary-foreground/40 px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:border-brand hover:text-brand sm:w-auto"
                        >
                            Book a Consultation
                        </Link>
                    </div>

                    <div className="mt-16 flex items-center gap-3 text-primary">
                        <ArrowDown
                            className="h-4 w-4 animate-bounce"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />

                        <span className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50">
                            Scroll
                        </span>
                    </div>
                </div>
            </section>

            {/* Search */}
            <section className="relative z-10 -mt-12 px-6 lg:px-10">
                <form
                    action="/properties"
                    method="get"
                    className="mx-auto grid max-w-[80rem] gap-4 border border-border bg-background p-6 shadow-[0_20px_60px_-40px_rgba(23,26,26,0.5)] md:grid-cols-3 lg:grid-cols-6 lg:p-8"
                >
                    <label className="block">
                        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                            Location
                        </span>

                        <select name="location" className={fieldClass} defaultValue="">
                            <option value="">Any location</option>

                            {locations.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                            Property type
                        </span>

                        <select name="type" className={fieldClass} defaultValue="">
                            <option value="">Any type</option>

                            {propertyTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                            Buy / Rent
                        </span>

                        <select name="transaction" className={fieldClass} defaultValue="sale">
                            <option value="sale">Buy</option>
                            <option value="rent">Rent</option>
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                            Price range
                        </span>

                        <select name="maxPrice" className={fieldClass} defaultValue="">
                            <option value="">Any price</option>
                            <option value="50000000">Up to KES 50M</option>
                            <option value="100000000">Up to KES 100M</option>
                            <option value="200000000">Up to KES 200M+</option>
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                            Bedrooms
                        </span>

                        <select name="beds" className={fieldClass} defaultValue="">
                            <option value="">Any</option>

                            {[1, 2, 3, 4, 5].map((number) => (
                                <option key={number} value={number}>
                                    {number}+
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center bg-primary px-6 py-3.5 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85"
                        >
                            Search Properties
                        </button>
                    </div>
                </form>
            </section>

            {/* Featured Properties */}
            <section className="mx-auto max-w-[88rem] px-6 py-24 lg:px-10 lg:py-32">
                <Reveal>
                    <SectionHeading
                        eyebrow="Featured"
                        title="Properties Worth Discovering."
                        description="A carefully curated collection of exceptional properties selected for lifestyle, location and long-term value."
                    />
                </Reveal>

                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featured.map((property, index) => (
                        <Reveal key={property.id} delay={index * 80}>
                            <PropertyCard property={property} />
                        </Reveal>
                    ))}
                </div>

                <Link
                    href="/properties"
                    className="mt-14 inline-block border-b border-primary/40 pb-1 text-xs font-medium uppercase tracking-[0.15em] text-primary transition-colors hover:border-brand hover:text-brand"
                >
                    View All Properties →
                </Link>
            </section>

            {/* Services */}
            <section className="border-y border-border bg-background py-24 lg:py-32">
                <div className="mx-auto max-w-[88rem] px-6 lg:px-10">
                    <Reveal>
                        <SectionHeading eyebrow="Services" title="More Than Property." />
                    </Reveal>

                    <div className="mt-16 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => (
                            <Reveal
                                key={service.title}
                                delay={index * 40}
                                className="bg-background p-10 lg:p-12"
                            >
                                <span className="block h-px w-10 bg-brand" />

                                <h3 className="mt-8 font-serif text-2xl text-foreground">
                                    {service.title}
                                </h3>

                                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                                    {service.description}
                                </p>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Loymax */}
            <section className="bg-primary py-24 text-primary-foreground lg:py-32">
                <div className="mx-auto max-w-[88rem] px-6 lg:px-10">
                    <Reveal>
                        <SectionHeading
                            eyebrow="Why Loymax"
                            title="Confidence in Every Property Decision."
                            tone="light"
                        />
                    </Reveal>

                    <div className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                        {differentiators.map((item, index) => (
                            <Reveal
                                key={item.title}
                                delay={index * 60}
                                className="border-t border-primary-foreground/20 pt-6"
                            >
                                <span className="text-xs font-medium uppercase tracking-[0.15em] text-brand">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <h3 className="mt-4 font-serif text-3xl">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
                                    {item.description}
                                </p>
                            </Reveal>
                        ))}
                    </div>

                    <div className="mt-20 grid grid-cols-2 gap-10 border-t border-primary-foreground/20 pt-12 lg:grid-cols-4">
                        {companyStats.map((stat) => (
                            <div key={stat.label}>
                                <p className="font-serif text-4xl md:text-5xl">
                                    {stat.value}
                                </p>

                                <p className="mt-3 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground/60">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Locations */}
            <section className="mx-auto max-w-[88rem] px-6 py-24 lg:px-10 lg:py-32">
                <Reveal>
                    <SectionHeading
                        eyebrow="Locations"
                        title="Explore Exceptional Locations."
                    />
                </Reveal>

                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {featuredLocations.map((location, index) => (
                        <Reveal key={location.slug} delay={index * 60}>
                            <Link href="/properties" className="group block">
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <Image
                                        src={location.image}
                                        alt={location.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                <h3 className="mt-5 font-serif text-2xl text-foreground">
                                    {location.name}
                                </h3>

                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {location.description}
                                </p>

                                <span className="mt-4 inline-block text-xs font-medium uppercase tracking-[0.15em] text-primary transition-colors group-hover:text-brand">
                                    Explore Properties
                                </span>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Sell */}
            <section className="border-y border-border bg-background">
                <div className="mx-auto grid max-w-[88rem] gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10 lg:py-32">
                    <Reveal>
                        <SectionHeading
                            eyebrow="Sell With Loymax"
                            title="Thinking of Selling Your Property?"
                        />
                    </Reveal>

                    <Reveal delay={80} className="lg:pt-16">
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            Position your property in front of the right buyers with a
                            professional marketing and sales strategy designed to maximise
                            its value.
                        </p>

                        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                            <Link
                                href="/sell"
                                className="inline-flex w-full items-center justify-center bg-primary px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85 sm:w-auto"
                            >
                                Sell With Loymax
                            </Link>

                            <Link
                                href="/sell#valuation"
                                className="inline-flex w-full items-center justify-center border border-brand px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-brand transition-colors hover:bg-brand hover:text-brand-foreground sm:w-auto"
                            >
                                Request a Property Valuation
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Investment */}
            <section className="mx-auto max-w-[88rem] px-6 py-24 lg:px-10 lg:py-32">
                <div className="grid gap-16 lg:grid-cols-2">
                    <Reveal>
                        <SectionHeading
                            eyebrow="Investment"
                            title="Property With Purpose."
                            description="We help investors evaluate opportunities on fundamentals — the qualities that hold value long after the transaction closes."
                        />

                        <Link
                            href="/developments"
                            className="mt-10 inline-flex items-center justify-center bg-primary px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85"
                        >
                            Explore Investment Opportunities
                        </Link>
                    </Reveal>

                    <Reveal delay={80}>
                        <ul className="grid gap-px border border-border bg-border sm:grid-cols-2">
                            {investmentCriteria.map((criterion) => (
                                <li
                                    key={criterion}
                                    className="bg-background p-8 font-serif text-xl text-foreground"
                                >
                                    {criterion}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            {/* Testimonials */}
            <section className="border-y border-border bg-background py-24 lg:py-32">
                <div className="mx-auto max-w-[88rem] px-6 lg:px-10">
                    <Reveal>
                        <SectionHeading
                            eyebrow="Clients"
                            title="Trusted by Our Clients."
                        />
                    </Reveal>

                    <div className="mt-16 grid gap-8 md:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <Reveal
                                key={testimonial.name}
                                delay={index * 70}
                                className="border border-border p-10"
                            >
                                <span
                                    className="font-serif text-4xl text-brand"
                                    aria-hidden="true"
                                >
                                    &ldquo;
                                </span>

                                <p className="mt-4 leading-relaxed text-foreground">
                                    {testimonial.quote}
                                </p>

                                <p className="mt-8 font-serif text-lg text-primary">
                                    {testimonial.name}
                                </p>

                                <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                                    {testimonial.role}
                                </p>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Insights */}
            <section className="mx-auto max-w-[88rem] px-6 py-24 lg:px-10 lg:py-32">
                <Reveal>
                    <SectionHeading eyebrow="Insights" title="The Loymax Journal." />
                </Reveal>

                <div className="mt-16 grid gap-12 md:grid-cols-3">
                    {articles.map((article, index) => (
                        <Reveal key={article.id} delay={index * 70}>
                            <Link
                                href={`/insights/${article.slug}`}
                                className="group block"
                            >
                                <div className="relative aspect-[3/2] overflow-hidden">
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                <div className="mt-5 flex items-center gap-4">
                                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-primary">
                                        {article.category}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(article.date)}
                                    </span>
                                </div>

                                <h3 className="mt-3 font-serif text-2xl leading-snug text-foreground">
                                    {article.title}
                                </h3>

                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                    {article.excerpt}
                                </p>

                                <span className="mt-5 inline-block text-xs font-medium uppercase tracking-[0.15em] text-primary transition-colors group-hover:text-brand">
                                    Read Article
                                </span>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative isolate overflow-hidden">
                <Image
                    src="/cta.jpg"
                    alt="Modern architecture at twilight"
                    fill
                    sizes="100vw"
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-foreground/70" />

                <div className="relative mx-auto max-w-[88rem] px-6 py-28 lg:px-10 lg:py-40">
                    <h2 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-primary-foreground md:text-6xl">
                        Your Next Property Decision Starts Here.
                    </h2>

                    <p className="mt-6 max-w-xl leading-relaxed text-primary-foreground/75">
                        Whether you&apos;re buying, selling, investing or looking for the right
                        property opportunity, our team is ready to help.
                    </p>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                        <Link
                            href="/contact"
                            className="inline-flex w-full items-center justify-center bg-primary px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85 sm:w-auto"
                        >
                            Book a Consultation
                        </Link>

                        <Link
                            href="/properties"
                            className="inline-flex w-full items-center justify-center border border-brand px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-brand transition-colors hover:bg-brand hover:text-brand-foreground sm:w-auto"
                        >
                            Explore Properties
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}