import { PageHeaderProps } from "@/lib/types";
import { Reveal } from "./Reveal";



export function PageHeader({
    eyebrow,
    title,
    description,
}: PageHeaderProps) {
    return (
        <section className="border-b border-border bg-background pb-16 pt-40 lg:pb-24 lg:pt-48">
            <div className="mx-auto max-w-[88rem] px-6 lg:px-10">
                <Reveal>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                        {eyebrow}
                    </p>

                    <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                    )}
                </Reveal>
            </div>
        </section>
    );
}