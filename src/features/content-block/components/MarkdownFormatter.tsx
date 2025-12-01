// src\features\content-block\components\MarkdownFormatter.tsx

"use client";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import React, { Ref } from "react";


const MARKDOWN_COMPONENTS: Components = {

  // Paragraphs:
  p: ({ node, ...props }) => (
    <p className="mb-4 last:mb-0" {...props} />
  ),

  // Bold:
  strong: ({ node, ...props }) => (
    <strong
      className="font-semibold text-gray-900 dark:text-gray-50"
      {...props}
    />
  ),

  // Lists:
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />
  ),
  li: ({ node, ...props }) => <li className="pl-1" {...props} />,

  // Headings:
  h1: ({ node, ...props }) => (
    <h1
      className="text-2xl font-bold mb-4 mt-6 first:mt-0 text-gray-900 dark:text-gray-50"
      {...props}
    />
  ),
  h2: ({ node, ...props }) => (
    <h2
      className="text-xl font-semibold mb-3 mt-5 first:mt-0 text-gray-900 dark:text-gray-50"
      {...props}
    />
  ),
  h3: ({ node, ...props }) => (
    <h3
      className="text-lg font-medium mb-2 mt-4 first:mt-0 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  // Blockquotes:
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4 text-gray-600 dark:text-gray-400"
      {...props}
    />
  ),

  // Links:
  a: ({ node, ...props }) => (
    <a
      className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
      {...props}
    />
  ),

  // --- TABLES ---
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto my-4 rounded-md border border-gray-200 dark:border-gray-700">
      <table
        className="w-full text-left border-collapse text-sm"
        {...props}
      />
    </div>
  ),
  thead: ({ node, ...props }) => (
    <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
  ),
  tbody: ({ node, ...props }) => (
    <tbody className="bg-white dark:bg-zinc-900" {...props} />
  ),
  tr: ({ node, ...props }) => (
    <tr
      className="border-b border-gray-200 dark:border-gray-700 last:border-0"
      {...props}
    />
  ),
  th: ({ node, ...props }) => (
    <th
      className="px-4 py-2 font-semibold text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td
      className="px-4 py-2 text-gray-700 dark:text-gray-300 align-top"
      {...props}
    />
  ),

  // --- CODE BLOCKS ---
  pre: ({ node, ...props }) => (
    <pre
      className="whitespace-pre-wrap font-sans overflow-auto bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-gray-800 p-3 rounded-md my-4"
      {...props}
    />
  ),
  code: ({ node, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const isBlock = !!match;

    return (
      <code
        className={`font-mono text-xs ${
          isBlock
            ? "block"
            : "bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5"
        } ${className || ""}`}
        {...props}
      >
        {children}
      </code>
    );
  },
};

const REMARK_PLUGINS = [remarkGfm];
const REHYPE_PLUGINS = [rehypeSanitize];

function MarkdownFormatterComponent({
  content,
  isExpanded,
  contentWrapperRef,
}: {
  content: string;
  isExpanded: boolean;
  contentWrapperRef: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={contentWrapperRef}
      className={`
          transition-all duration-300
          ${isExpanded ? "max-h-none" : "max-h-28"}
          overflow-hidden
          text-gray-800 dark:text-gray-200 
          text-sm leading-relaxed 
        `}
    >
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
        components={MARKDOWN_COMPONENTS} // Pass the stable object
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}


const MarkdownFormatter = React.memo(MarkdownFormatterComponent, (prevProps, nextProps) => {
  return (
    prevProps.content === nextProps.content && prevProps.isExpanded === nextProps.isExpanded
  );
});

MarkdownFormatter.displayName = "MarkdownFormatter";

export default MarkdownFormatter;