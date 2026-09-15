import { PageHeader } from "@/components/site/PageHeader";
import { LeadForm } from "@/components/site/LeadForm";
import { contactDetails } from "@/lib/data/site";

export default function ContactPage() {
    return (
        <>
            <PageHeader
                eyebrow="Contact"
                title="Book a Consultation."
                description="Tell us what you are trying to achieve. A consultant will respond within one business day."
            />

            <section className="mx-auto grid max-w-[88rem] gap-16 px-6 py-20 lg:grid-cols-[1fr_1.2fr] lg:px-10 lg:py-28">
                <div>
                    <dl className="space-y-8">
                        <div className="border-b border-border pb-6">
                            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                                Phone
                            </dt>

                            <dd className="mt-3 font-serif text-2xl text-foreground">
                                <a
                                    href={`tel:${contactDetails.phone}`}
                                    className="transition-colors hover:text-primary"
                                >
                                    {contactDetails.phone}
                                </a>
                            </dd>
                        </div>

                        <div className="border-b border-border pb-6">
                            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                                Email
                            </dt>

                            <dd className="mt-3 text-lg text-foreground">
                                <a
                                    href={`mailto:${contactDetails.email}`}
                                    className="transition-colors hover:text-primary"
                                >
                                    {contactDetails.email}
                                </a>
                            </dd>
                        </div>

                        <div className="border-b border-border pb-6">
                            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                                WhatsApp
                            </dt>

                            <dd className="mt-3 text-lg text-foreground">
                                {contactDetails.whatsapp}
                            </dd>
                        </div>

                        <div className="border-b border-border pb-6">
                            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                                Office
                            </dt>

                            <dd className="mt-3 leading-relaxed text-foreground">
                                {contactDetails.address}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                                Business hours
                            </dt>

                            <dd className="mt-3 leading-relaxed text-foreground">
                                {contactDetails.hours}
                            </dd>
                        </div>
                    </dl>
                </div>

                <LeadForm type="consultation" />
            </section>
        </>
    );
}