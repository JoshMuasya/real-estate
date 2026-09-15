export type TransactionType = "sale" | "rent";
export type PropertyStatus = "For Sale" | "For Rent" | "New" | "Reserved" | "Sold";

export interface Agent {
    name: string;
    title: string;
    phone: string;
    email: string;
}

export interface Property {
    id: string;
    title: string;
    slug: string;
    location: string;
    propertyType: string;
    transactionType: TransactionType;
    price: number;
    currency: string;
    bedrooms: number;
    bathrooms: number;
    parking: number;
    area: number;
    landSize?: number;
    description: string;
    features: string[];
    amenities: string[];
    images: string[];
    status: PropertyStatus;
    featured: boolean;
    published: boolean;
    agent: Agent;
    createdAt: string;
    updatedAt: string;
}

export interface FeaturedLocation {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Article {
    id: string;
    slug: string;
    title: string;
    category: string;
    date: string;
    readingTime: string;
    excerpt: string;
    image: string;
    featured: boolean;
    published: boolean;
    body: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    quote: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PageHeaderProps {
    eyebrow: string;
    title: string;
    description?: string;
}

export interface PropertiesExplorerInitialFilters {
    location?: string;
    type?: string;
    transaction?: TransactionType | "";
    maxPrice?: string;
    beds?: string;
}

export interface PropertiesExplorerProps {
    lockedTransaction?: TransactionType;
    properties: Property[];
    initialFilters?: PropertiesExplorerInitialFilters;
}

export type LeadFormType = "viewing" | "info" | "general" | "sell" | "valuation" | "consultation";
export type LeadCategory = "inquiry" | "viewing" | "consultation";
export type LeadStatus = "new" | "contacted" | "closed";

export interface Lead {
    id: string;
    category: LeadCategory;
    formType: LeadFormType;
    name: string;
    email: string;
    phone: string;
    message: string;
    subject?: string;
    propertyId?: string;
    propertySlug?: string;
    status: LeadStatus;
    createdAt: string;
    updatedAt: string;
}

export type UserRole = "admin" | "agent";

export interface SessionUser {
    uid: string;
    email: string;
    role: UserRole;
    name?: string;
}