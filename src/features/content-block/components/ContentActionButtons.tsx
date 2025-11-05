//  src\features\content-block\components\ContentActionButtons.tsx
"use client";
import { Button } from "@/components/ui/button";
import { ContentBlockTable } from "@/drizzle/schema";
import { SquarePen, Trash2 } from "lucide-react";
import { updateBlock } from "../actions/content-block";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import DeleteAlertBox from "@/features/repo/components/AlertDelete";

export function ContentActionButtons({
  input,
  userId,
  role,
}: {
  input: typeof ContentBlockTable.$inferSelect;
  userId: string | undefined;
  role: "admin" | "editor" | "viewer" | undefined;
}) {
  const pathname = usePathname();

  const handleUpdate = async () => {
    try {
      // await updateBlock(pathname, input);
    } catch (error) {
      console.log(error);
    }
  };

  const orientationVertical = input.type === "h1";

  return (
    <>
      {!orientationVertical && (
        <div>
          {input.createdAt.toLocaleDateString()}
          {" ~ "}
          Updated at {input.updatedAt.toLocaleString()}
        </div>
      )}

      {(userId && role !== "viewer") && (
        <>
          <div
            className={`flex items-center justify-between gap-2 ${
              orientationVertical && "mr-6"
            }`}
          >
            <Button
              className="cursor-pointer"
              onClick={handleUpdate}
              title="Edit"
            >
              <SquarePen />
            </Button>
            <DeleteAlertBox
              title={input.type}
              contentId={input.id}
              repoId={input.repoId}
            >
              <Button
                className="cursor-pointer"
                title="Delete"
                variant={"destructive"}
              >
                <Trash2 />
              </Button>
            </DeleteAlertBox>
          </div>
        </>
      )}
    </>
  );
}
