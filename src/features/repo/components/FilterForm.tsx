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
import { sortBy } from "@/lib/types/sorttypes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { repoStatus } from "@/lib/types/repoTypes";

export default function FilterForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState<repoStatus | "all">(
    (searchParams.get("status") as repoStatus) || "all"
  );
  const [sortBy, setSortBy] = useState<sortBy>(
    (searchParams.get("sortBy") as sortBy) || "updated_desc"
  );
  const [debouncedSearch] = useDebounce(search, 500);
  // I added use-debounce to prevent firing a search on every keystroke.

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    if (sortBy) {
      params.set("sortBy", sortBy);
    } else {
      params.delete("sortBy");
    }

    params.delete("page"); //reset to page 1 when filters change
    const newUrl = `${pathname}?${params.toString()}`;

    // 👇 ADD THIS LINE TO DEBUG THE CLIENT
    console.log("CLIENT BROWSER: Pushing new URL ->", newUrl);

    router.push(newUrl); // update url
  }, [debouncedSearch, status, sortBy, pathname, router]); // NOTE: adding searchParams to dependency array, doesn't work;

  return (
    <>
      <Input
        placeholder="Find a repository..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        value={status}
        onValueChange={(value) => setStatus(value as repoStatus | "all")}
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

      <Select
        value={sortBy}
        onValueChange={(value) => setSortBy(value as sortBy)}
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
    </>
  );
}
