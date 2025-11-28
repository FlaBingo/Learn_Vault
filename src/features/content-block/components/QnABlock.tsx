// src\features\content-block\components\QnABlock.tsx

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

import { CardContent } from "@/components/ui/card";
import { CornerDownRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Define a constant for the clamp height (Tailwind's max-h-28 = 7rem = 112px)
const MAX_CLAMP_HEIGHT_PX = 112;

export default function QnABlock({
  question,
  answer
}: {
  question: string;
  answer: string;
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
  }, [answer]);

  // Gracefully handle potentially null/empty content
  const answerContent = answer || "";

  return (
    <CardContent className="flex flex-col gap-2">
      <div className="flex gap-3">
        <CornerDownRight className="hidden md:block h-5 w-5 text-gray-500 flex-shrink-0" />

        <div className="flex-1 min-w-0">
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
                // FIX: Removed 'inline' from props, used className to apply logic
                code: ({ node, className, children, ...props }) => {
                  // In standard markdown, block code usually has a language class (e.g., language-js)
                  // or is wrapped in a <pre> (handled by the pre component above).
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
              {answerContent}
            </ReactMarkdown>
          </div>

          {isOverflowing && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:underline mt-2 cursor-pointer"
              aria-expanded={isExpanded}
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>
    </CardContent>
  );
}