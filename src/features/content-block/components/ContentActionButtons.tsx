//  src\features\content-block\components\ContentActionButtons.tsx
"use client"
import { Button } from "@/components/ui/button";
import { ContentBlockTable } from "@/drizzle/schema";
import { SquarePen, Trash2 } from "lucide-react";

export function ContentActionButtons({
  input,
}: {
  input: typeof ContentBlockTable.$inferSelect;
}) {
  return (
    <>
      <div>
        {input.createdAt.toLocaleDateString()}
        {" ~ "}
        Updated at {input.updatedAt.toLocaleString()}
      </div>
      <div className="flex items-center justify-between gap-2">
        <Button className="cursor-pointer" title="Edit">
          <SquarePen />
        </Button>
        <Button
          className="cursor-pointer"
          title="Delete"
          variant={"destructive"}
        >
          <Trash2 />
        </Button>
      </div>
    </>
  );
}


export function ContentVerticalButtons({input}: {input: typeof ContentBlockTable.$inferSelect;}){
  return (
    <>
      {/* <div>
        {input.createdAt.toLocaleDateString()}
        {" ~ "}
        Updated at {input.updatedAt.toLocaleString()}
      </div> */}
      <div className="flex items-center justify-between gap-2 mr-6">
        <Button className="cursor-pointer" title="Edit">
          <SquarePen />
        </Button>
        <Button
          className="cursor-pointer"
          title="Delete"
          variant={"destructive"}
        >
          <Trash2 />
        </Button>
      </div>
    </>
  );
}