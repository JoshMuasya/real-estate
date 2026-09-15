import type { Metadata } from "next";

import HomePage from "@/components/Homepage";

export const metadata: Metadata = {
  title: "Loymax Properties | Exceptional Properties. Thoughtful Investments.",
  description:
    "Discover distinguished homes, investment opportunities and exceptional spaces curated by Loymax Properties across Kenya.",
  openGraph: {
    title: "Loymax Properties | Exceptional Properties. Thoughtful Investments.",
    description:
      "A premium property consultancy for buyers, sellers and investors across Nairobi, Kiambu, Kajiado, Mombasa and Naivasha.",
  },
};

export default function Home() {
  return (
    <HomePage />
  );
}
