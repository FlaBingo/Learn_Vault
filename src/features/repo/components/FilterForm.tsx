// src/features/repo/components/FilterForm.tsx
"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";

export default function FilterForm({ mode }: { mode?: "explore" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch] = useDebounce(search, 500);

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    params.delete("page"); //reset to page 1 when filters change
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname); // update url
  }, [debouncedSearch, pathname, router]);

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Find a repository..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {mode !== "explore" && (
        <Select
        value={searchParams.get("status") || "all"}
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Type</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="public">Public</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      )}

      <Select
        value={searchParams.get("sortBy") || "updated_desc"}
        onValueChange={(value) => handleFilterChange("sortBy", value)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort</SelectLabel>
            <SelectItem value="updated_desc">Last Updated</SelectItem>
            <SelectItem value="title_asc">Title (A-Z)</SelectItem>
            <SelectItem value="title_desc">Title (Z-A)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
