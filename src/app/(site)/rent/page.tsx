import type { Metadata } from "next";

import { PageHeader } from "@/components/site/PageHeader";
import { PropertiesExplorer } from "@/components/site/PropertiesExplorer";
import { getPublishedProperties } from "@/lib/firebase/properties";

export const metadata: Metadata = {
    title: "Property to Rent in Kenya | Loymax Properties",
    description:
        "Homes, apartments and commercial space to let, with professional support for landlords and tenants throughout the rental process.",
    openGraph: {
        title: "Property to Rent in Kenya | Loymax Properties",
        description:
            "Well-managed rental homes and commercial space, professionally represented.",
    },
};

export default async function RentPage() {
    const properties = await getPublishedProperties();

    return (
        <>
            <PageHeader
                eyebrow="Rent"
                title="Places Worth Settling Into."
                description="Rental homes and commercial space managed to a standard that protects both landlord and tenant."
            />

            <section className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 lg:py-28">
                <PropertiesExplorer lockedTransaction="rent" properties={properties} />
            </section>
        </>
    );
}