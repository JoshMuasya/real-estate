import type { Metadata } from "next";

import { PageHeader } from "@/components/site/PageHeader";
import { PropertiesExplorer } from "@/components/site/PropertiesExplorer";
import { getPublishedProperties } from "@/lib/firebase/properties";

export const metadata: Metadata = {
    title: "Property for Sale in Kenya | Loymax Properties",
    description:
        "Homes, apartments, commercial buildings and land for sale, selected for lifestyle, location and long-term value.",
    openGraph: {
        title: "Property for Sale in Kenya | Loymax Properties",
        description:
            "Considered properties for sale across Nairobi, the coast and beyond.",
    },
};

export default async function BuyPage() {
    const properties = await getPublishedProperties();

    return (
        <>
            <PageHeader
                eyebrow="Buy"
                title="Buy With Judgement."
                description="We help buyers identify properties aligned with their lifestyle and investment objectives — and advise honestly when a property is not the right one."
            />

            <section className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 lg:py-28">
                <PropertiesExplorer lockedTransaction="sale" properties={properties} />
            </section>
        </>
    );
}