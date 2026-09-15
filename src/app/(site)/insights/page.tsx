import type { Metadata } from "next";

import Insights from "@/components/insights/Insights";

export const metadata: Metadata = {
    title: "The Loymax Journal | Property Insights in Kenya",
    description:
        "Editorial notes on real estate investment, buying property in Kenya, market trends, property management and diaspora investment.",
    openGraph: {
        title: "The Loymax Journal | Property Insights",
        description:
            "Considered writing on property, investment and the Kenyan market.",
    },
};

const page = () => {
    return (
        <div>
            <Insights />
        </div>
    );
};

export default page;