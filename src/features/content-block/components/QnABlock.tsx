// src\features\content-block\components\QnABlock.tsx

"use client";

import { CardContent } from "@/components/ui/card";
import { CornerDownRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import MarkdownFormatter from "./MarkdownFormatter";

// Define a constant for the clamp height (Tailwind's max-h-28 = 7rem = 112px)
const MAX_CLAMP_HEIGHT_PX = 112;

export default function QnABlock({
  answer,
}: {
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
        {/* Icon indicating an answer */}
        <CornerDownRight className="hidden md:block h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />

        <div className="flex-1 min-w-0">
          <MarkdownFormatter content={answerContent} contentWrapperRef={contentWrapperRef} isExpanded={isExpanded} />  

          {/* Show More/Less Button */}
          {isOverflowing && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 cursor-pointer select-none"
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
