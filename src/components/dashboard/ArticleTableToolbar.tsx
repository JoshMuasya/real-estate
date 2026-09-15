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

const ALL = "all";

export function ArticleTableToolbar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("q") ?? "");
    const [category, setCategory] = useState(searchParams.get("category") ?? "");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const categoryDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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

    useEffect(() => {
        clearTimeout(categoryDebounceRef.current);
        categoryDebounceRef.current = setTimeout(() => {
            if (category !== (searchParams.get("category") ?? "")) {
                updateParam("category", category);
            }
        }, 300);
        return () => clearTimeout(categoryDebounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by title or category"
                    className="h-9 pl-8"
                    aria-label="Search articles"
                />
            </div>

            <Input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Category"
                className="h-9 w-full sm:w-40"
                aria-label="Filter by category"
            />

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
                    <SelectItem value="title">Title A–Z</SelectItem>
                </SelectContent>
            </Select>

            <Button render={<Link href="/dashboard/insights/new" />} className="sm:ml-auto">
                <Plus className="size-4" />
                Add Article
            </Button>
        </div>
    );
}
