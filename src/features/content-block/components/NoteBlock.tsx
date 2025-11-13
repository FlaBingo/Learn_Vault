// src\features\content-block\components\NoteBlock.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { ContentBlockTable } from "@/drizzle/schema";

// Define a constant for the clamp height (Tailwind's max-h-28 = 7rem = 112px)
const MAX_CLAMP_HEIGHT_PX = 112;

export default function NoteBlock({
  input,
}: {
  input: typeof ContentBlockTable.$inferSelect;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const element = contentRef.current;
    if (element) {
      // Check if the content's scrollHeight is greater than the clamp height
      if (element.scrollHeight > MAX_CLAMP_HEIGHT_PX) {
        setIsOverflowing(true);
      } else {
        setIsOverflowing(false);
      }
    }
    // Re-run this check if the content text ever changes
  }, [input.content]);

  return (
    <div>
      {/* 1. The main note content */}
      <pre
        ref={contentRef}
        className={`
          whitespace-pre-wrap 
          font-sans 
          transition-all duration-300
          ${
            isExpanded
              ? "max-h-none" // Unclamped height
              : "max-h-28" // Clamped height (7rem / 112px)
          }
          overflow-hidden
        `}
      >
        {input.content || ""}
      </pre>

      {/* 2. "Show more/less" button */}
      {/* Only show if the text is overflowing its clamped height */}
      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:underline mt-2 cursor-pointer"
          aria-expanded={isExpanded}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}

      {/* 3. The description (always visible) */}
      {input.description && (
        <div className="text-sm text-muted-foreground mt-2 pt-2 border-t border-dashed">
          {input.description}
        </div>
      )}
    </div>
  );
}