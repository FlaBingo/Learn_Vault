// src/features/content-block/components/CommandModal.tsx

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  BLOCK_OPTIONS,
  BlockOption,
} from "@/lib/content-block-utils/block-options";
import { useEffect, useRef, useState } from "react";

export function CommandModal({
  className,
  onSelect,
  isOpen,
}: {
  className?: string;
  onSelect?: (option: BlockOption) => void;
  isOpen?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isOpen]);

  return (
    <Command
      className={cn("rounded-lg border shadow-md md:min-w-[450px]", className)}
    >
      <CommandInput
        ref={inputRef}
        placeholder="Type a command or search..."
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
