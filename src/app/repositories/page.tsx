import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auth } from "@/services/auth";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <div className="flex gap-2">
        <Input placeholder="Find a repository..." />
        <Select>
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
        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort</SelectLabel>
              <SelectItem value="last-updated">last updated</SelectItem>
              <SelectGroup>
                <SelectLabel>alphabetical</SelectLabel>
                <SelectItem value="ascending">ascending</SelectItem>
                <SelectItem value="descending">descending</SelectItem>
              </SelectGroup>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        {/* // here goes the list */}
      </div>
    </>
  );
}
