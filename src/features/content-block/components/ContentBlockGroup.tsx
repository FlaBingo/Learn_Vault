// src/features/content-block/components/ContentBlockGroup.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import ContentBlockEditor from "./content-block-editor";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { CommandDemo } from "./CommandDemo";

export default function ContentBlockGroup() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  function handleCardClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    inputRef.current?.focus();
    if(inputRef.current?.value.startsWith("/")){
      setIsOpen(true);
    }
  }

  return (
    <div>
      <Card className="dark:border-gray-600">
        <CardHeader>
          <CardTitle>Content Page</CardTitle>
        </CardHeader>
        <CardContent
          onClick={handleCardClick}
          className="min-h-[500px]"
        >
          <Input
            ref={inputRef}
            value={inputValue}
            className="border-none outline-none shadow-none"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <CommandDemo className={`${isOpen ? "block" : "hidden"}`}/>
        </CardContent>
      </Card>
    </div>
  );
}
