// src\features\content-block\components\QnABlock.tsx

"use client";

import { CardContent } from "@/components/ui/card";
import { CornerDownRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ContentBlockTable } from "@/drizzle/schema";

// Define a constant for the clamp height (Tailwind's max-h-28 = 7rem = 112px)
const MAX_CLAMP_HEIGHT_PX = 112;

export default function QnABlock({
  input,
}: {
  input: typeof ContentBlockTable.$inferSelect;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const answerRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const element = answerRef.current;
    if (element) {
      // Check if the full height of the content (scrollHeight)
      // is greater than the height we plan to clamp it to.
      if (element.scrollHeight > MAX_CLAMP_HEIGHT_PX) {
        setIsOverflowing(true);
      } else {
        setIsOverflowing(false);
      }
    }
    // Re-run this check if the answer text ever changes
  }, [input.description]);

  // Gracefully handle potentially null/empty descriptions
  const answerText = input.description || "";

  return (
    // Use flex-col to stack the question and answer
    <CardContent className="flex flex-col gap-2">
      {/* 2. The Answer Section */}
      <div className="flex gap-3">
        <CornerDownRight className="h-5 w-5 text-gray-500 flex-shrink-0" />

        {/* Wrapper for the answer text and the "Show more" button */}
        <div className="flex-1 min-w-0">
          <pre
            ref={answerRef}
            className={`
              w-full
              whitespace-pre-wrap
              font-sans text-sm
              transition-all duration-300
              ${
                isExpanded
                  ? "max-h-none" // Unclamp
                  : "max-h-28" // 7rem (112px)
              }
              overflow-hidden
            `}
          >
            {answerText}
          </pre>

          {/* 3. The "Show more/less" Button */}
          {/* Only show the button if the text is overflowing */}
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
