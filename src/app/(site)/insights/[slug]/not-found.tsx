import Link from "next/link";

export default function NotFound() {
    return (
        <div className="mx-auto max-w-2xl px-6 py-48 text-center">
            <h1 className="font-serif text-5xl text-foreground">Article unavailable</h1>

            <Link
                href="/insights"
                className="mt-10 inline-block bg-primary px-8 py-4 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/85"
            >
                Back to the journal
            </Link>
        </div>
    );
}
