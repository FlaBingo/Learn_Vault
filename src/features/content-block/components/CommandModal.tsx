// src/features/content-block/components/CommandModal.tsx

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  BLOCK_OPTIONS,
  BlockOption,
} from "@/lib/content-block-utils/block-options";
import { RefObject, useEffect, useRef } from "react";

export function CommandModal({
  className,
  onSelect,
  isOpen,
  setIsOpen,
  setInputValue,
  parentInputRef,
}: {
  className?: string;
  onSelect?: (option: BlockOption) => void;
  isOpen?: boolean;
  setIsOpen: ( isOpen: boolean) => void;
  setInputValue: ( inputValue: string) => void;
  parentInputRef: RefObject<HTMLInputElement | null>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Backspace" && e.currentTarget.value === "") {
      e.preventDefault();
      setIsOpen(false);
      setInputValue("");
      parentInputRef.current?.focus();
    }
  }

  return (
    <Command
      className={cn("rounded-lg border shadow-md md:min-w-[450px] overflow-auto", className)}
    >
      <CommandInput
        ref={inputRef}
        placeholder="Type a command or search..."
        onKeyDown={handleKeyDown}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {BLOCK_OPTIONS.map((option) => (
            <CommandItem
              key={option.id}
              disabled={option.id === "pdf"}
              onSelect={() => onSelect?.(option)}
            >
              <option.icon />
              <span>{option.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
