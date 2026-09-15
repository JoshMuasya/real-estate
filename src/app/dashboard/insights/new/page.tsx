import type { Metadata } from "next";

import { verifyRole } from "@/lib/auth/dal";
import { NewArticleClient } from "./NewArticleClient";

export const metadata: Metadata = {
    title: "Add Article",
    description: "Write and publish a new article.",
};

export default async function NewArticlePage() {
    await verifyRole("admin");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-foreground">Add Article</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Fill in the details below. You can save as a draft and publish later.
                </p>
            </div>
            <NewArticleClient />
        </div>
    );
}
