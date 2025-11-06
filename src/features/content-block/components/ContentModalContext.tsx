"use client";
import { createContext, useContext, useState } from "react";
import { ContentType } from "@/drizzle/schema";

type ContentModalContextType = {
  showDialog: boolean;
  setShowDialog: (value: boolean) => void;
  contentId: ContentType | null;
  setContentId: (id: ContentType | null) => void;
  content: string;
  setContent: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  blockId: string;
  setBlockId: (value: string) => void;
  order: number;
};

const ContentModalContext = createContext<ContentModalContextType | null>(null);

export function ContentModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [contentId, setContentId] = useState<ContentType | null>(null);
  const [content, setContent] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [blockId, setBlockId] = useState("");
  const [order, setOrder] = useState<number>(0);
  return (
    <ContentModalContext.Provider
      value={{ showDialog, setShowDialog, contentId, setContentId, content, setContent, description, setDescription, blockId, setBlockId, order }}
    >
      {children}
    </ContentModalContext.Provider>
  );
}



export function useContentModal() {
  const ctx = useContext(ContentModalContext);
  if (!ctx)
    throw new Error(
      "useContentModal must be used within a ContentModalProvider"
    );
  return ctx;
}
