// src/features/content-block/components/ContentBlockGroup.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { CommandModal } from "./CommandModal";
import ContentFormModal from "./DataModal";
import { ContentType } from "@/drizzle/schema";

export default function ContentBlockGroup({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [contentId, setContentId] = useState<ContentType | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null);
  function handleCardClick(e: React.MouseEvent<HTMLDivElement>) {
    // used this if condition instead of writing e.stopPropagation() in every component
    if(e.target === e.currentTarget){
      e.preventDefault();
      inputRef.current?.focus();
    }
  }

  useEffect(() => {
    if (inputValue.startsWith("/")) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [inputValue]);

  return (
    <div>
      <Card className="dark:border-gray-600">
        <CardHeader>
          <CardTitle>Content Page</CardTitle>
        </CardHeader>
        <CardContent onClick={handleCardClick} className="min-h-[500px]">
          { children }
          <Input
            ref={inputRef}
            value={inputValue}
            className="border-none outline-none shadow-none"
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Click here and type '/ '..."
          />
          <CommandModal
            className={`${isOpen ? "block" : "hidden"}`}
            isOpen={isOpen}
            onSelect={(option) => {
              // option?.action();
              setContentId(option.id)
              setIsOpen(false);
              setInputValue("");
              // inputRef.current?.focus();
              setShowDialog(true);
            }}
          />

          <ContentFormModal
            open={showDialog}
            onOpenChange={setShowDialog}
            contentId={contentId}
            
          >
            <div />
          </ContentFormModal>
        </CardContent>
      </Card>
    </div>
  );
}
