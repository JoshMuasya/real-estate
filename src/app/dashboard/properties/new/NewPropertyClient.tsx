"use client";

import { useState } from "react";
import { nanoid } from "nanoid";

import { PropertyForm } from "@/components/dashboard/property-form/PropertyForm";

export function NewPropertyClient() {
    const [draftId] = useState(() => nanoid(10));
    return <PropertyForm mode="create" propertyId={draftId} />;
}
