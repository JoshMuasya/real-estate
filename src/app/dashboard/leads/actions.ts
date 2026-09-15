"use server";

import { revalidatePath } from "next/cache";

import { verifyRole } from "@/lib/auth/dal";
import { deleteLead, updateLeadStatus } from "@/lib/firebase/leads";
import type { LeadStatus } from "@/lib/types";

function revalidateLeadRoutes() {
    revalidatePath("/dashboard/inquiries");
    revalidatePath("/dashboard/viewings");
    revalidatePath("/dashboard/consultations");
}

export async function updateLeadStatusAction(id: string, status: LeadStatus): Promise<void> {
    await verifyRole("admin", "agent");
    await updateLeadStatus(id, status);
    revalidateLeadRoutes();
}

export async function deleteLeadAction(id: string): Promise<void> {
    await verifyRole("admin", "agent");
    await deleteLead(id);
    revalidateLeadRoutes();
}
