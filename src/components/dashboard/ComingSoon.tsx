import { Sparkles } from "lucide-react";

export function ComingSoon({ feature }: { feature: string }) {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-24 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-dash-active/10 text-dash-active">
                <Sparkles className="size-5" strokeWidth={1.5} />
            </div>
            <h2 className="mt-6 font-serif text-2xl text-foreground">{feature} is coming soon</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                This section is planned for a future phase of the Loymax Properties dashboard.
            </p>
        </div>
    );
}
