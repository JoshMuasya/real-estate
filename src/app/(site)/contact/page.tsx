import type { Metadata } from "next";

import ContactPage from "@/components/Contact";

export const metadata: Metadata = {
    title: "Book a Consultation | Loymax Properties",
    description:
        "Speak with a Loymax property consultant about buying, selling, letting or investing in property in Kenya.",
    openGraph: {
        title: "Book a Consultation | Loymax Properties",
        description:
            "Your next property decision starts with a conversation.",
    },
};

const page = () => {
    return (
        <ContactPage />
    );
};

export default page;