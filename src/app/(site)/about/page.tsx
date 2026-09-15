import type { Metadata } from 'next'

import AboutPage from '@/components/About'

export const metadata: Metadata = {
    title: "About Loymax Properties | Built Around Trust",
    description:
        "Loymax Properties is a Kenyan property consultancy built on professionalism, integrity, market knowledge and long-term client relationships.",
    openGraph: {
        title: "About Loymax Properties | Built Around Trust",
        description:
            "A property consultancy built around trust and driven by property.",
    },
}

const page = () => {
    return (
        <AboutPage />
    )
}

export default page