// src\features\content-block\components\NoteBlock.tsx

"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import MarkdownFormatter from "./MarkdownFormatter";

// Define a constant for the clamp height (112px)
const MAX_CLAMP_HEIGHT_PX = 112;

export default function NoteBlock({
  content,
  description,
}: {
  content: string;
  description: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = contentWrapperRef.current;
    if (element) {
      if (element.scrollHeight > MAX_CLAMP_HEIGHT_PX) {
        setIsOverflowing(true);
      } else {
        setIsOverflowing(false);
      }
    }
  }, [content]);

  const memoizedMarkdown = useMemo(() => (
    <MarkdownFormatter content={content} contentWrapperRef={contentWrapperRef} isExpanded={isExpanded} />
  ), [content, isExpanded])

  return (
    <div className="overflow-x-auto">

      {memoizedMarkdown} 

      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 cursor-pointer select-none"
          aria-expanded={isExpanded}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}

      {description && (
        <div className="text-sm text-muted-foreground mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
          {description}
        </div>
      )}
    </div>
  );
}
