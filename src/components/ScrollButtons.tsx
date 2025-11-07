"use client";

import { ArrowUp, ArrowDown } from "lucide-react"; // Using lucide-react icons, common in Next.js
import { Button } from "./ui/button";

/**
 * A vertical control bar fixed to the left side of the screen.
 * The top half scrolls to the page top, and the bottom half scrolls to the page bottom.
 */
export default function ScrollButtons() {
  // Function to scroll to the top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Function to scroll to the bottom smoothly
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed right-60 bottom-20 z-50 h-30 w-10 flex flex-col gap-3">
      <Button
        onClick={scrollToTop}
        variant={"outline"}
        className="flex-1 w-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:z-10 rounded-none cursor-pointer "
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-6 w-6"/>
      </Button>
      {/* Separator Line */}
      {/* <div className="w-full h-px bg-gray-600"></div> */}
      <Button
        onClick={scrollToBottom}
        variant={"outline"}
        className="flex-1 w-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:z-10 rounded-none cursor-pointer " 
        aria-label="Scroll to bottom"
      >
        <ArrowDown className="h-6 w-6" />
      </Button>
    </div>
  );
}