"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";


import { PropertyCard } from "./PropertyCard";
import { Reveal } from "./Reveal";
import { fieldClass } from "./ui";
import { cn } from "@/lib/utils";
import { PropertiesExplorerProps, TransactionType } from "@/lib/types";
import { amenityOptions, locations, propertyTypes } from "@/lib/data/properties";

type Sort = "newest" | "price-asc" | "price-desc";

const PAGE_SIZE = 6;


export function PropertiesExplorer({
    lockedTransaction,
    properties,
    initialFilters,
}: PropertiesExplorerProps) {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState(initialFilters?.location ?? "");
    const [type, setType] = useState(initialFilters?.type ?? "");
    const [transaction, setTransaction] = useState<TransactionType | "">(
        lockedTransaction ?? initialFilters?.transaction ?? "",
    );
    const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice ?? "");
    const [beds, setBeds] = useState(initialFilters?.beds ?? "");
    const [baths, setBaths] = useState("");
    const [amenities, setAmenities] = useState<string[]>([]);
    const [sort, setSort] = useState<Sort>("newest");
    const [visible, setVisible] = useState(PAGE_SIZE);

    const results = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        const list = properties.filter((property) => {
            if (
                normalizedQuery &&
                !`${property.title} ${property.location} ${property.propertyType}`
                    .toLowerCase()
                    .includes(normalizedQuery)
            ) {
                return false;
            }

            if (location && property.location !== location) {
                return false;
            }

            if (type && property.propertyType !== type) {
                return false;
            }

            if (
                transaction &&
                property.transactionType !== transaction
            ) {
                return false;
            }

            if (maxPrice && property.price > Number(maxPrice)) {
                return false;
            }

            if (beds && property.bedrooms < Number(beds)) {
                return false;
            }

            if (baths && property.bathrooms < Number(baths)) {
                return false;
            }

            if (
                amenities.length &&
                !amenities.every((amenity) =>
                    property.amenities.includes(amenity),
                )
            ) {
                return false;
            }

            return true;
        });

        return [...list].sort((a, b) => {
            if (sort === "price-asc") {
                return a.price - b.price;
            }

            if (sort === "price-desc") {
                return b.price - a.price;
            }

            return b.createdAt.localeCompare(a.createdAt);
        });
    }, [
        properties,
        query,
        location,
        type,
        transaction,
        maxPrice,
        beds,
        baths,
        amenities,
        sort,
    ]);

    function updateQuery(value: string) {
        setQuery(value);
        setVisible(PAGE_SIZE);
    }

    function updateLocation(value: string) {
        setLocation(value);
        setVisible(PAGE_SIZE);
    }

    function updateType(value: string) {
        setType(value);
        setVisible(PAGE_SIZE);
    }

    function updateTransaction(value: TransactionType | "") {
        setTransaction(value);
        setVisible(PAGE_SIZE);
    }

    function updateMaxPrice(value: string) {
        setMaxPrice(value);
        setVisible(PAGE_SIZE);
    }

    function updateBeds(value: string) {
        setBeds(value);
        setVisible(PAGE_SIZE);
    }

    function updateBaths(value: string) {
        setBaths(value);
        setVisible(PAGE_SIZE);
    }

    function toggleAmenity(amenity: string) {
        setVisible(PAGE_SIZE);

        setAmenities((current) =>
            current.includes(amenity)
                ? current.filter((item) => item !== amenity)
                : [...current, amenity],
        );
    }

    function reset() {
        setQuery("");
        setLocation("");
        setType("");
        setTransaction(lockedTransaction ?? "");
        setMaxPrice("");
        setBeds("");
        setBaths("");
        setAmenities([]);
        setVisible(PAGE_SIZE);
    }

    return (
        <div className="grid gap-12 lg:grid-cols-[19rem_1fr]">
            {/* Filters */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                    <SlidersHorizontal
                        className="h-4 w-4 text-primary"
                        strokeWidth={1.4}
                        aria-hidden="true"
                    />

                    <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-foreground">
                        Refine
                    </h2>

                    <button
                        type="button"
                        onClick={reset}
                        className="ml-auto text-xs text-muted-foreground transition-colors hover:text-brand"
                    >
                        Clear all
                    </button>
                </div>

                <div className="mt-6 space-y-5">
                    {/* Search */}
                    <input
                        className={fieldClass}
                        placeholder="Search by name or area"
                        value={query}
                        onChange={(event) => updateQuery(event.target.value)}
                        aria-label="Search properties"
                    />

                    {/* Location */}
                    <select
                        className={fieldClass}
                        value={location}
                        onChange={(event) => updateLocation(event.target.value)}
                        aria-label="Location"
                    >
                        <option value="">All locations</option>

                        {locations.map((locationOption) => (
                            <option key={locationOption} value={locationOption}>
                                {locationOption}
                            </option>
                        ))}
                    </select>

                    {/* Property Type */}
                    <select
                        className={fieldClass}
                        value={type}
                        onChange={(event) => updateType(event.target.value)}
                        aria-label="Property type"
                    >
                        <option value="">All property types</option>

                        {propertyTypes.map((propertyType) => (
                            <option key={propertyType} value={propertyType}>
                                {propertyType}
                            </option>
                        ))}
                    </select>

                    {/* Transaction */}
                    {!lockedTransaction && (
                        <div className="grid grid-cols-3 gap-2">
                            {(
                                [
                                    { label: "All", value: "" },
                                    { label: "Buy", value: "sale" },
                                    { label: "Rent", value: "rent" },
                                ] as const
                            ).map((option) => {
                                const selected = transaction === option.value;

                                return (
                                    <button
                                        key={option.label}
                                        type="button"
                                        onClick={() => updateTransaction(option.value)}
                                        aria-pressed={selected}
                                        className={cn(
                                            "px-2 py-3 text-xs font-medium uppercase tracking-[0.12em] transition-colors",
                                            selected
                                                ? "border border-primary bg-primary text-primary-foreground"
                                                : "border border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Maximum Price */}
                    <select
                        className={fieldClass}
                        value={maxPrice}
                        onChange={(event) => updateMaxPrice(event.target.value)}
                        aria-label="Maximum price"
                    >
                        <option value="">Any price</option>
                        <option value="500000">Up to KES 500,000</option>
                        <option value="50000000">Up to KES 50M</option>
                        <option value="100000000">Up to KES 100M</option>
                        <option value="200000000">Up to KES 200M</option>
                    </select>

                    {/* Bedrooms / Bathrooms */}
                    <div className="grid grid-cols-2 gap-3">
                        <select
                            className={fieldClass}
                            value={beds}
                            onChange={(event) => updateBeds(event.target.value)}
                            aria-label="Minimum bedrooms"
                        >
                            <option value="">Beds</option>

                            {[1, 2, 3, 4, 5].map((number) => (
                                <option key={number} value={number}>
                                    {number}+
                                </option>
                            ))}
                        </select>

                        <select
                            className={fieldClass}
                            value={baths}
                            onChange={(event) => updateBaths(event.target.value)}
                            aria-label="Minimum bathrooms"
                        >
                            <option value="">Baths</option>

                            {[1, 2, 3, 4, 5].map((number) => (
                                <option key={number} value={number}>
                                    {number}+
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amenities */}
                    <div>
                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            Amenities
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {amenityOptions.map((amenity) => {
                                const selected = amenities.includes(amenity);

                                return (
                                    <button
                                        key={amenity}
                                        type="button"
                                        onClick={() => toggleAmenity(amenity)}
                                        aria-pressed={selected}
                                        className={cn(
                                            "border px-3 py-2 text-xs transition-colors",
                                            selected
                                                ? "border-brand text-brand"
                                                : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                                        )}
                                    >
                                        {amenity}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Results */}
            <div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                    <p className="text-sm text-muted-foreground">
                        <span className="text-foreground">
                            {results.length}
                        </span>{" "}
                        {results.length === 1 ? "property" : "properties"}
                    </p>

                    <label className="flex items-center gap-3 text-sm">
                        <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                            Sort
                        </span>

                        <select
                            className="border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                            value={sort}
                            onChange={(event) => {
                                setSort(event.target.value as Sort);
                                setVisible(PAGE_SIZE);
                            }}
                            aria-label="Sort properties"
                        >
                            <option value="newest">Newest</option>
                            <option value="price-asc">
                                Price: Low to High
                            </option>
                            <option value="price-desc">
                                Price: High to Low
                            </option>
                        </select>
                    </label>
                </div>

                {results.length === 0 ? (
                    <p className="py-24 text-center text-muted-foreground">
                        No properties match these filters yet. Try widening your
                        search.
                    </p>
                ) : (
                    <div className="mt-10 grid gap-8 sm:grid-cols-2">
                        {results.slice(0, visible).map((property, index) => (
                            <Reveal
                                key={property.id}
                                delay={(index % 2) * 80}
                            >
                                <PropertyCard property={property} />
                            </Reveal>
                        ))}
                    </div>
                )}

                {visible < results.length && (
                    <div className="mt-14 text-center">
                        <button
                            type="button"
                            onClick={() =>
                                setVisible((current) => current + PAGE_SIZE)
                            }
                            className="border border-primary px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                            Load more properties
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}