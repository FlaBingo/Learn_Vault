// KatexDisplay.js
'use client'; // Required for client-side rendering in App Router

import { useEffect, useRef } from 'react';
import katex from 'katex';

const KatexDisplay = ({ equation }: {equation: string}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(equation, containerRef.current, {
        throwOnError: false, // Prevents errors from stopping rendering
      });
    }
  }, [equation]);

  return <span ref={containerRef} />;
};

export default KatexDisplay;