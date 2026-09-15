import Link from "next/link";

export default function NotFound() {
    return (
        <div className="mx-auto max-w-2xl px-6 py-48 text-center">
            <h1 className="font-serif text-5xl text-foreground">Property unavailable</h1>

            <p className="mt-5 text-muted-foreground">
                This property may have been sold, let or withdrawn from the market.
            </p>

            <Link
                href="/properties"
                className="mt-10 inline-block bg-primary px-8 py-4 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85"
            >
                View all properties
            </Link>
        </div>
    );
}
