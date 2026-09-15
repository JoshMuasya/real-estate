import { PageHeader } from "../site/PageHeader";
import { PropertiesExplorer } from "../site/PropertiesExplorer";
import { getPublishedProperties } from "@/lib/firebase/properties";
import type { TransactionType } from "@/lib/types";

interface PropertiesPageProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

function firstValue(value: string | string[] | undefined): string {
    return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
    const properties = await getPublishedProperties();

    const params = searchParams ?? {};
    const transactionParam = firstValue(params.transaction);
    const transaction: TransactionType | "" =
        transactionParam === "sale" || transactionParam === "rent" ? transactionParam : "";

    return (
        <>
            <PageHeader
                eyebrow="Property Search"
                title="Every Property, Considered."
                description="Filter by location, type, budget and amenities to find properties that match how you want to live or invest."
            />

            <section className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 lg:py-28">
                <PropertiesExplorer
                    properties={properties}
                    initialFilters={{
                        location: firstValue(params.location),
                        type: firstValue(params.type),
                        transaction,
                        maxPrice: firstValue(params.maxPrice),
                        beds: firstValue(params.beds),
                    }}
                />
            </section>
        </>
    );
}