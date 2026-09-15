import { contactDetails } from "@/lib/data/site";
import Link from "next/link";


const columns = [
    {
        title: "Explore",
        links: [
            { label: "Properties", href: "/properties" },
            { label: "Buy", href: "/buy" },
            { label: "Rent", href: "/rent" },
            { label: "Sell", href: "/sell" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "Services", href: "/services" },
            { label: "About", href: "/about" },
            { label: "Insights", href: "/insights" },
            { label: "Contact", href: "/contact" },
        ],
    },
];

const socials = ["Instagram", "Facebook", "LinkedIn", "TikTok"];

export function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10">
                <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
                    {/* Brand */}
                    <div>
                        <Link
                            href="/"
                            className="inline-block font-serif text-2xl tracking-[0.28em]"
                            aria-label="Loymax Properties home"
                        >
                            LOYMAX
                        </Link>

                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
                            Properties
                        </p>

                        <p className="mt-6 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
                            Exceptional properties. Thoughtful investments. A property
                            consultancy built around trust, judgement and long-term value.
                        </p>

                        {/* Social Links */}
                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                            {socials.map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="text-[0.72rem] uppercase tracking-[0.14em] text-primary-foreground/70 transition-colors hover:text-brand"
                                    aria-label={`Loymax Properties on ${social}`}
                                >
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {columns.map((column) => (
                        <div key={column.title}>
                            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/50">
                                {column.title}
                            </h3>

                            <ul className="mt-6 space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-primary-foreground/80 transition-colors hover:text-brand"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/50">
                            Contact
                        </h3>

                        <ul className="mt-6 space-y-3 text-sm text-primary-foreground/80">
                            <li>
                                <a
                                    href={`tel:${contactDetails.phone}`}
                                    className="transition-colors hover:text-brand"
                                >
                                    {contactDetails.phone}
                                </a>
                            </li>

                            <li>
                                <a
                                    href={`mailto:${contactDetails.email}`}
                                    className="transition-colors hover:text-brand"
                                >
                                    {contactDetails.email}
                                </a>
                            </li>

                            <li>WhatsApp {contactDetails.whatsapp}</li>

                            <li className="pt-2 text-primary-foreground/60">
                                {contactDetails.address}
                            </li>

                            <li className="text-primary-foreground/60">
                                {contactDetails.hours}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-16 flex flex-col gap-4 border-t border-primary-foreground/15 pt-8 text-[0.72rem] tracking-[0.08em] text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Loymax Properties. All rights reserved.</p>

                    <div className="flex gap-6">
                        <Link
                            href="/privacy"
                            className="transition-colors hover:text-brand"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            href="/terms"
                            className="transition-colors hover:text-brand"
                        >
                            Terms &amp; Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}