import type { Metadata } from "next";

import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
    title: "Privacy Policy | Loymax Properties",
    description:
        "How Loymax Properties collects, uses and protects personal information.",
    openGraph: {
        title: "Privacy Policy | Loymax Properties",
        description:
            "Our approach to personal data and privacy.",
    },
};

export default function PrivacyPage() {
    return (
        <>
            <PageHeader
                eyebrow="Legal"
                title="Privacy Policy."
            />

            <section className="mx-auto max-w-2xl space-y-6 px-6 py-20 text-muted-foreground lg:py-28">
                <p>
                    We collect only the information needed to respond to your enquiry
                    and provide property services: your name, contact details and the
                    details you choose to share about your requirements.
                </p>

                <p>
                    Information is used to respond to enquiries, arrange viewings and
                    provide property advice. We do not sell personal information to
                    third parties.
                </p>

                <p>
                    You may request access to, correction of, or deletion of your
                    information at any time by contacting our office.
                </p>
            </section>
        </>
    );
}