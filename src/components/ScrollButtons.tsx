"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export default function ScrollButtons() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showBottomBtn, setShowBottomBtn] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Show "Scroll to Top" button if user has scrolled down
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }

      // Check if user is near the bottom
      // (window.innerHeight + window.scrollY) >= document.body.offsetHeight
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50; // 50px buffer

      if (isAtBottom) {
        setShowBottomBtn(false);
      } else {
        setShowBottomBtn(true);
      }
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Initial check in case page loads not at the top
    handleScroll();

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {/* Scroll to Top Button */}
      {showTopBtn && (
        <Button
          onClick={scrollToTop}
          className="p-2 rounded-full bg-gray-800 text-white shadow-lg transition-opacity duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        </Button>
      )}

      {/* Scroll to Bottom Button */}
      {showBottomBtn && (
        <Button
          onClick={scrollToBottom}
          className="p-2 rounded-full bg-gray-800 text-white shadow-lg transition-opacity duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label="Scroll to bottom"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </Button>
      )}
    </div>
  );
}