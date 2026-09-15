import type { Metadata } from "next"

import PropertiesPage from "@/components/properties/Properties"

export const metadata: Metadata = {
    title: "Properties for Sale & Rent | Loymax Properties",
    description:
        "Browse a curated collection of homes, apartments, commercial space and land across Nairobi, Kiambu, Kajiado, Mombasa and Naivasha.",
    openGraph: {
        title: "Properties for Sale & Rent | Loymax Properties",
        description:
            "A curated collection of exceptional properties across Kenya.",
    },
}

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const page = async ({ searchParams }: PageProps) => {
    const params = await searchParams;

    return (
        <>
            <PropertiesPage searchParams={params} />
        </>
    )
}

export default page