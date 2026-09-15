import type { Metadata } from "next";

import { verifyRole } from "@/lib/auth/dal";
import { getAllTestimonials } from "@/lib/firebase/testimonials";
import { TestimonialsClient } from "@/components/dashboard/TestimonialsClient";

export const metadata: Metadata = {
    title: "Testimonials",
    description: "Manage client testimonials shown on the website.",
};

export default async function TestimonialsPage() {
    await verifyRole("admin");
    const items = await getAllTestimonials();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-foreground">Testimonials</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {items.length} testimonial{items.length === 1 ? "" : "s"} on record
                </p>
            </div>
            <TestimonialsClient items={items} />
        </div>
    );
}
