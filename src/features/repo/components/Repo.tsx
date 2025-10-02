import { Button } from "@/components/ui/button";
import { RepoTable } from "@/drizzle/schema";
import Link from "next/link";

export type RepoType = typeof RepoTable.$inferSelect;

export default async function RepoStructure({
  id,
  title,
  description,
  status,
  createdAt,
  updatedAt,
}: RepoType) {
  return (
    <div className="flex justify-between">
      <div>
        <div className="flex gap-3">
          <Button variant={"link"} className="font-bold p-0" asChild>
            <Link href={`/repo-${id}`}>{title}</Link>
          </Button>
          <p className="my-auto border-2 text-sm px-2 rounded-xl py-0.5">
            {status}
          </p>
        </div>
        <p className="text-sm text-muted-foreground py-2">{description}</p>
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
      <div>buttons</div>
    </div>
  );
}
