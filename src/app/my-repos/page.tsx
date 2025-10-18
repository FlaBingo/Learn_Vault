// app/my-repos/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { repoStatuses, repoStatus } from "@/drizzle/schema";
import { getMyRepos } from "@/features/repo/actions/repo";
import FilterForm from "@/features/repo/components/FilterForm";
import PaginationControls from "@/features/repo/components/PaginationControls";
import RepoStructure from "@/features/repo/components/Repo";
import { sortBy, sortByOptions } from "@/lib/types/sorttypes";
import { auth } from "@/services/auth";
import { redirect, RedirectType } from "next/navigation";

export default async function RepositoriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {

  const session = await auth();
  if(!session){
    redirect("/login", RedirectType.replace);
  }
  
  const resolvedSearchParams = await searchParams;

  // extract the searchParams
  const search =
    typeof resolvedSearchParams.search === "string"
      ? resolvedSearchParams.search
      : undefined;
  const status = repoStatuses.includes(
    resolvedSearchParams.status as repoStatus
  )
    ? (resolvedSearchParams.status as repoStatus)
    : undefined; // this f*cking line wasted my 4 hours
  const sortBy = sortByOptions.includes(resolvedSearchParams.sortBy as sortBy)
    ? (resolvedSearchParams.sortBy as sortBy)
    : "updated_desc";
  const page =
    typeof resolvedSearchParams.page === "string"
      ? Number(resolvedSearchParams.page)
      : 1;

  // console.log(status, sortBy, search); // resolved: url shows status=private or public but here the value is still undefined
  // console.log(await searchParams) // it worked
  const response = await getMyRepos({ search, status, sortBy, page });
  const { data: repos, pagination } = response;

  return (
    <>
      <div className="flex gap-2">
        <FilterForm />
      </div>

      <Card className="my-5">
        <CardHeader>
          <CardTitle>Your Repositories</CardTitle>
          <CardDescription>
            Showing {repos.length} of {pagination.totalCount} repositories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {repos.length > 0 ? (
            repos.map((repo) => (
              <div key={repo.id}>
                <RepoStructure {...repo} />
                <Separator className="my-4" />
              </div>
            ))
          ) : (
            <p>No repositories found.</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          {/*  */}
          <PaginationControls pagination={pagination} />
        </CardFooter>
      </Card>
    </>
  );
}
