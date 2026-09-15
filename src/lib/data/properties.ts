import { Property } from "@/lib/types";

export const propertyTypes = [
    "Villa",
    "Apartment",
    "Penthouse",
    "Townhouse",
    "Commercial",
    "Land",
] as const;

export const locations = ["Nairobi", "Kiambu", "Kajiado", "Mombasa", "Naivasha"] as const;

export const amenityOptions = [
    "Swimming Pool",
    "Gym",
    "24/7 Security",
    "Borehole",
    "Backup Generator",
    "Garden",
    "Lift",
    "Staff Quarters",
];

export function formatPrice(property: Pick<Property, "price" | "currency" | "transactionType">) {
    const value = new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(
        property.price,
    );
    return `${property.currency} ${value}${property.transactionType === "rent" ? " / month" : ""}`;
}
