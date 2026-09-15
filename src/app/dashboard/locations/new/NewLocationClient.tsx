"use client";

import { useState } from "react";
import { nanoid } from "nanoid";

import { LocationForm } from "@/components/dashboard/location-form/LocationForm";

export function NewLocationClient() {
    const [draftId] = useState(() => nanoid(10));
    return <LocationForm mode="create" locationId={draftId} />;
}
