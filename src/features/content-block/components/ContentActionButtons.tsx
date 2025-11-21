//  src\features\content-block\components\ContentActionButtons.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  collaboratorRole,
  ContentBlockTable,
  repoStatus,
} from "@/drizzle/schema";
import { SquarePen, Trash2 } from "lucide-react";
import { updateBlock } from "../actions/content-block";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import DeleteAlertBox from "@/features/repo/components/AlertDelete";
import { useContentModal } from "./ContentModalContext";
import {
  formatCreateDate,
  formatUpdateDate,
} from "@/lib/content-block-utils/date-formatter";

export function ContentActionButtons({
  input,
  userId,
  role,
  owner,
}: {
  input: typeof ContentBlockTable.$inferSelect;
  userId: string | undefined;
  role: collaboratorRole | undefined;
  owner: boolean;
}) {
  const { setShowDialog, setContentBlock } = useContentModal();

  const handleUpdate = async () => {
    setContentBlock(input);
    setShowDialog(true);
  };

  const orientationVertical = input.type === "h1";

  return (
    <>
      {!orientationVertical && (
        <div>
          {formatCreateDate(input.createdAt.toISOString())}

          {formatCreateDate(input.createdAt.toISOString()) !==
            formatCreateDate(input.updatedAt.toISOString()) &&
            `${" ~ "} Updated at ${formatUpdateDate(
              input.updatedAt.toISOString()
            )}`}
        </div>
      )}

      {((userId && role !== "viewer" && role !== undefined) || owner) && (
        <div
          className={`hidden hover:flex items-center justify-between gap-2 ${
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
      )}
    </>
  );
}
