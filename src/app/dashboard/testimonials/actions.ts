"use server";

import { revalidatePath } from "next/cache";

import { verifyRole } from "@/lib/auth/dal";
import {
    createTestimonial,
    deleteTestimonial,
    updateTestimonial,
    type TestimonialInput,
} from "@/lib/firebase/testimonials";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/validation/testimonial";

function revalidatePublicRoutes() {
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/dashboard/testimonials");
}

function toTestimonialInput(values: TestimonialFormValues): TestimonialInput {
    return {
        name: values.name,
        role: values.role,
        quote: values.quote,
        published: values.published,
    };
}

export async function createTestimonialAction(values: TestimonialFormValues) {
    await verifyRole("admin");
    const parsed = testimonialSchema.parse(values);
    await createTestimonial(toTestimonialInput(parsed));
    revalidatePublicRoutes();
}

export async function updateTestimonialAction(id: string, values: TestimonialFormValues) {
    await verifyRole("admin");
    const parsed = testimonialSchema.parse(values);
    await updateTestimonial(id, toTestimonialInput(parsed));
    revalidatePublicRoutes();
}

export async function deleteTestimonialAction(id: string) {
    await verifyRole("admin");
    await deleteTestimonial(id);
    revalidatePublicRoutes();
}

export async function toggleTestimonialPublishedAction(id: string, published: boolean) {
    await verifyRole("admin");
    await updateTestimonial(id, { published });
    revalidatePublicRoutes();
}
