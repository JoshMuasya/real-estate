import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
    label,
    value,
    description,
    icon: Icon,
    accent = false,
}: {
    label: string;
    value: number | string;
    description: string;
    icon: LucideIcon;
    accent?: boolean;
}) {
    return (
        <Card className="gap-0 py-0">
            <CardContent className="flex items-start justify-between gap-4 p-6">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-3 font-serif text-3xl text-foreground">{value}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </div>
                <div
                    className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-full",
                        accent ? "bg-dash-accent/10 text-dash-accent" : "bg-dash-active/10 text-dash-active",
                    )}
                >
                    <Icon className="size-5" strokeWidth={1.5} />
                </div>
            </CardContent>
        </Card>
    );
}
