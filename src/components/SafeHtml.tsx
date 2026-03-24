// src\components\SafeHtml.tsx

"use client";

import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";

interface SafeHtmlProps {
  html: string;
  className?: string;
}

export default function SafeHtml({ html, className }: SafeHtmlProps) {
  // Sanitize the HTML string
  const sanitizedContent = DOMPurify.sanitize(html || "");

  return (
    <div
      className={cn(
        // 'prose' styles the text, 'overflow-x-auto' handles long formulas
        "prose prose-sm dark:prose-invert max-w-none prose-p:mb-4 last:prose-p:mb-0 overflow-x-auto",
        // Targeting the specific class the Tiptap math extension uses
        "[&_.Tiptap-mathematics]:my-4 [&_.Tiptap-mathematics]:text-center",
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}