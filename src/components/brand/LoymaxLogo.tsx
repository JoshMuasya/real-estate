import { cn } from "@/lib/utils";

export function LoymaxLogo({
    className,
    barClassName,
    textClassName,
}: {
    className?: string;
    barClassName?: string;
    textClassName?: string;
}) {
    return (
        <span className={cn("flex items-center gap-3", className)}>
            <span className={cn("block h-8 w-px bg-current", barClassName)} />
            <span className={cn("leading-[0.95]", textClassName)}>
                <span className="block font-serif text-xl tracking-[0.28em]">LOYMAX</span>
                <span className="block text-[0.55rem] font-medium uppercase tracking-[0.2em] opacity-70">
                    Properties
                </span>
            </span>
        </span>
    );
}
