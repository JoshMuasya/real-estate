"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { locations, propertyTypes } from "@/lib/data/properties";
import { propertyStatusValues } from "@/lib/validation/property";

const ALL = "all";

export function PropertyTableToolbar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("q") ?? "");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    function updateParam(key: string, value: string | null) {
        const params = new URLSearchParams(searchParams.toString());
        if (!value || value === ALL) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    }

    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (search !== (searchParams.get("q") ?? "")) {
                updateParam("q", search);
            }
        }, 300);
        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by title or location"
                    className="h-9 pl-8"
                    aria-label="Search properties"
                />
            </div>

            <Select value={searchParams.get("type") ?? ALL} onValueChange={(value) => updateParam("type", value)}>
                <SelectTrigger className="h-9 w-full sm:w-40">
                    <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL}>All types</SelectItem>
                    {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                            {type}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={searchParams.get("location") ?? ALL} onValueChange={(value) => updateParam("location", value)}>
                <SelectTrigger className="h-9 w-full sm:w-40">
                    <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL}>All locations</SelectItem>
                    {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                            {location}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={searchParams.get("status") ?? ALL} onValueChange={(value) => updateParam("status", value)}>
                <SelectTrigger className="h-9 w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL}>All statuses</SelectItem>
                    {propertyStatusValues.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={searchParams.get("published") ?? ALL} onValueChange={(value) => updateParam("published", value)}>
                <SelectTrigger className="h-9 w-full sm:w-36">
                    <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL}>All</SelectItem>
                    <SelectItem value="true">Published</SelectItem>
                    <SelectItem value="false">Draft</SelectItem>
                </SelectContent>
            </Select>

            <Select value={searchParams.get("sort") ?? "newest"} onValueChange={(value) => updateParam("sort", value)}>
                <SelectTrigger className="h-9 w-full sm:w-40">
                    <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="title">Title A–Z</SelectItem>
                </SelectContent>
            </Select>

            <Button nativeButton={false} render={<Link href="/dashboard/properties/new" />} className="sm:ml-auto">
                <Plus className="size-4" />
                Add Property
            </Button>
        </div>
    );
}
