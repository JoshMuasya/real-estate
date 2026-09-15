import type { Metadata } from "next";

import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
    title: "Terms & Conditions | Loymax Properties",
    description:
        "Terms governing the use of the Loymax Properties website and property listings.",
    openGraph: {
        title: "Terms & Conditions | Loymax Properties",
        description:
            "Terms of use for the Loymax Properties website.",
    },
};

export default function TermsPage() {
    return (
        <>
            <PageHeader
                eyebrow="Legal"
                title="Terms & Conditions."
            />

            <section className="mx-auto max-w-2xl space-y-6 px-6 py-20 text-muted-foreground lg:py-28">
                <p>
                    Property information on this website is provided in good faith and
                    is intended as a general guide. Particulars, measurements and prices
                    should be verified before any commitment.
                </p>

                <p>
                    Availability and pricing may change without notice. Nothing on this
                    website constitutes an offer or contract.
                </p>

                <p>
                    Content, imagery and branding on this website remain the property of
                    Loymax Properties and may not be reproduced without written
                    permission.
                </p>
            </section>
        </>
    );
}