"use client";

import { useState, useEffect } from "react";
import { quotes } from "@/lib/quotes/quotes";

export default function QuoteLoader() {

  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center max-w-lg p-4 text-center">
      <div className="w-10 h-10 mb-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>

      {/* Quote Container */}
      <div className="min-h-[80px] flex flex-col justify-center animate-in fade-in duration-700">
        {quote ? (
          <>
            <div className="text-lg font-medium text-gray-700 dark:text-gray-200 italic">
              &ldquo;{quote.text}&rdquo;
            </div>
            <span className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              — {quote.author}
            </span>
          </>
        ) : (
          // Optional: A generic text while the random math runs (usually instant)
          <div className="text-gray-400 text-sm">Organizing your repository...</div>
        )}
      </div>
    </div>
  );
}