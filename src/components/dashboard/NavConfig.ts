import type { LucideIcon } from "lucide-react";
import {
    Building2,
    CalendarClock,
    FileText,
    ImageIcon,
    Inbox,
    LayoutDashboard,
    MapPin,
    Newspaper,
    Quote,
    Settings,
    Users,
} from "lucide-react";

import type { UserRole } from "@/lib/types";

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    roles: UserRole[];
    status: "active" | "soon";
}

export const NAV_SECTIONS: { heading: string; items: NavItem[] }[] = [
    {
        heading: "Overview",
        items: [
            { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "agent"], status: "active" },
        ],
    },
    {
        heading: "Properties",
        items: [
            { label: "All Properties", href: "/dashboard/properties", icon: Building2, roles: ["admin", "agent"], status: "active" },
        ],
    },
    {
        heading: "Leads",
        items: [
            { label: "Inquiries", href: "/dashboard/inquiries", icon: Inbox, roles: ["admin", "agent"], status: "active" },
            { label: "Viewing Requests", href: "/dashboard/viewings", icon: CalendarClock, roles: ["admin", "agent"], status: "active" },
            { label: "Consultations", href: "/dashboard/consultations", icon: Users, roles: ["admin", "agent"], status: "active" },
        ],
    },
    {
        heading: "Content",
        items: [
            { label: "Insights", href: "/dashboard/insights", icon: Newspaper, roles: ["admin"], status: "active" },
            { label: "Testimonials", href: "/dashboard/testimonials", icon: Quote, roles: ["admin"], status: "active" },
            { label: "Locations", href: "/dashboard/locations", icon: MapPin, roles: ["admin"], status: "active" },
            { label: "Media Library", href: "/dashboard/media", icon: ImageIcon, roles: ["admin"], status: "active" },
        ],
    },
    {
        heading: "Website",
        items: [
            { label: "Website Content", href: "/dashboard/content", icon: FileText, roles: ["admin"], status: "soon" },
        ],
    },
    {
        heading: "Settings",
        items: [
            { label: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["admin", "agent"], status: "active" },
        ],
    },
];

export function navSectionsForRole(role: UserRole) {
    return NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) => item.roles.includes(role)),
    })).filter((section) => section.items.length > 0);
}
