"use client";

import { useState } from "react";
import { nanoid } from "nanoid";

import { ArticleForm } from "@/components/dashboard/article-form/ArticleForm";

export function NewArticleClient() {
    const [draftId] = useState(() => nanoid(10));
    return <ArticleForm mode="create" articleId={draftId} />;
}
