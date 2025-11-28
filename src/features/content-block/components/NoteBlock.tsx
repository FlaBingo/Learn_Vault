// src\features\content-block\components\NoteBlock.tsx

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { useState, useEffect, useRef } from "react";

// Define a constant for the clamp height (Tailwind's max-h-28 = 7rem = 112px)
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
  
  // Changed ref to HTMLDivElement to wrap the ReactMarkdown component
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = contentWrapperRef.current;
    if (element) {
      // Check if the wrapper's scrollHeight is greater than the clamp height
      if (element.scrollHeight > MAX_CLAMP_HEIGHT_PX) {
        setIsOverflowing(true);
      } else {
        setIsOverflowing(false);
      }
    }
    // Re-run this check if the content text ever changes
  }, [content]);

  return (
    <div>
      {/* 1. The main note content (Markdown Rendered) */}
      <div
        ref={contentWrapperRef}
        className={`
          transition-all duration-300
          ${isExpanded ? "max-h-none" : "max-h-28"}
          overflow-hidden
        `}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={{
            pre: ({ node, ...props }) => (
              <pre
                className="whitespace-pre-wrap font-sans overflow-auto"
                {...props}
              />
            ),
            // FIX: Removed 'inline' prop to prevent TS error
            code: ({ node, className, children, ...props }) => {
              // Detect block code via className (usually "language-xyz")
              const match = /language-(\w+)/.exec(className || "");
              const isBlock = !!match;

              return (
                <code
                  className={`font-mono bg-gray-100 rounded px-1 py-[2px] ${
                    isBlock ? "block p-2" : ""
                  } ${className || ""}`}
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {content || ""}
        </ReactMarkdown>
      </div>

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
      {description && (
        <div className="text-sm text-muted-foreground mt-2 pt-2 border-t border-dashed">
          {description}
        </div>
      )}
    </div>
  );
}