"use client";

import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";

interface SafeHtmlProps {
  html: string;
  className?: string;
}

/**
 * A reusable component to safely render HTML from Tiptap or other sources.
 * Uses isomorphic-dompurify to prevent XSS and Tailwind Typography (prose) 
 * to ensure formatting (bold, lists, etc.) is visible.
 */
export default function SafeHtml({ html, className }: SafeHtmlProps) {
  // Sanitize the HTML string
  const sanitizedContent = DOMPurify.sanitize(html || "");

  return (
    <div
      className={cn(
        // 'prose' is required for Tailwind to show <strong>, <ul>, etc.
        "prose prose-sm dark:prose-invert max-w-none prose-p:mb-4 last:prose-p:mb-0",
        // Allow custom spacing or colors via props
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}