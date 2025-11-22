import { Button } from "@/components/ui/button";
import { RepoTable } from "@/drizzle/schema";
import { SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import DeleteAlertBox from "./AlertDelete";
import { getUserByRepoId } from "../actions/repo";
import { emailToUsername } from "@/lib/user-utils/utils";

export type RepoType = typeof RepoTable.$inferSelect;

export default async function RepoStructure({
  id,
  title,
  description,
  status,
  createdAt,
  updatedAt,
  mode,
}: RepoType & { mode?: "explore" }) {
  const userData = await getUserByRepoId(id);
  const username = emailToUsername(userData?.email);

  return (
    <div className="flex justify-between gap-3">
      <div className="w-full overflow-hidden">
        <div className="flex gap-3">
          <Button variant={"link"} className="font-bold p-0" asChild>
            <Link href={`/repo/${id}`}>{title}</Link>
          </Button>
          {mode !== "explore" ? (
            <div className="hidden md:block my-auto border-2 text-sm px-2 rounded-xl py-0.5">
              {status}
            </div>
          ) : (
            <div className="my-auto select-none">~</div>
          )}
          {mode === "explore" && (
            <div className="my-auto text-muted-foreground text-xs">
              <Link href={`/profile/${username}`} className="hover:underline">@{username}</Link>
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground py-2">
          {description &&
            (description.length > 100
              ? `${description.substring(0, 100)}...`
              : description)}
        </div>
        <div className="text-muted-foreground text-xs">
          <span>created at </span>
          {createdAt.toLocaleDateString()}
          {createdAt.toLocaleDateString !== updatedAt.toLocaleDateString ? (
            <>
              {"  "} ~ {"  "}
              <span>updated at </span>
              {updatedAt.toLocaleDateString()}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      {mode !== "explore" && (
        <div className="flex gap-4">
          <Link href={`repo-details/${id}`}>
            <Button className="cursor-pointer" title="Edit">
              <SquarePen />
            </Button>
          </Link>
          <DeleteAlertBox title={title} repoId={id}>
            <Button
              variant={"destructive"}
              className="cursor-pointer"
              title="Delete"
            >
              <Trash2 />
            </Button>
          </DeleteAlertBox>
        </div>
      )}
    </div>
  );
}
