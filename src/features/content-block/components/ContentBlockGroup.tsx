// src/features/content-block/components/ContentBlockGroup.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { CommandModal } from "./CommandModal";
import ContentFormModal from "./DataModal";
import { collaboratorRole, ContentType } from "@/drizzle/schema";
import { useContentModal } from "./ContentModalContext";

export default function ContentBlockGroup({
  children,
  userId,
  role,
  owner,
}: {
  children: React.ReactNode;
  userId: string | undefined;
  role: collaboratorRole | undefined;
  owner: boolean;
}) {
  const { showDialog, setShowDialog, contentId, setContentId, setContent, setDescription, setBlockId, setContentBlock } =
    useContentModal();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  // const [showDialog, setShowDialog] = useState(false);
  // const [contentId, setContentId] = useState<ContentType | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // const pathname = usePathname();
  function handleClickFocus(e: React.MouseEvent<HTMLDivElement>) {
    // used this 'if condition' instead of writing e.stopPropagation() in every component
    if (e.target === e.currentTarget) {
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
      <Card className="dark:border-gray-600 bg-gray-100 dark:bg-gray-700 backdrop-blur-lg">
        <CardContent onClick={handleClickFocus} className="min-h-[500px]">
          {children}
          {((userId && role !== "viewer" && role !== undefined) || owner) && (
            <>
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  className={`border-none outline-none shadow-none mt-7 mb-96`}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Click here and start typing or type '/ '..."
                />
                <CommandModal
                  className={`${
                    isOpen ? "block absolute top-10 z-10 min-h-80 " : "hidden"
                  }`}
                  isOpen={isOpen}
                  parentInputRef={inputRef}
                  setIsOpen={setIsOpen}
                  setInputValue={setInputValue}
                  onSelect={(option) => {
                    setBlockId("");
                    setContent("");
                    setDescription("");
                    setContentId(option.id);
                    setContentBlock(undefined)
                    setShowDialog(true);
                    setInputValue("");
                    setIsOpen(false);
                  }}
                />
              </div>

              <ContentFormModal
                open={showDialog}
                onOpenChange={setShowDialog}
                contentId={contentId}
              >
                <div />
              </ContentFormModal>
            </>
          )}
          {(!userId || !owner) && <div className="h-90 opacity-0"></div>}
        </CardContent>
      </Card>
    </div>
  );
}
