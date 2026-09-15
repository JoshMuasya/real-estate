import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FormRow({
    label,
    htmlFor,
    error,
    children,
    className,
    optional,
}: {
    label: string;
    htmlFor?: string;
    error?: string;
    children: React.ReactNode;
    className?: string;
    optional?: boolean;
}) {
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <Label htmlFor={htmlFor}>
                {label}
                {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
            </Label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

export function SectionCard({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl text-foreground">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            <div className="mt-6 space-y-5">{children}</div>
        </div>
    );
}
