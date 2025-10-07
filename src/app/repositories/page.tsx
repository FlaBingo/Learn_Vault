// app/repositories/page.tsx
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

export default async function RepositoriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // extract the searchParams
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;


  // const status = repoStatuses.includes(searchParams.status as repoStatus) ? (searchParams.status as repoStatus) : undefined; // this f*cking line wasted my 4 hours
  // const status =
  //   searchParams.status === "public" || searchParams.status === "private"
  //     ? (searchParams.status as repoStatus)
  //     : undefined; // doesn't work 😭😭
  const status = searchParams.status as repoStatus; // doesn't work


  
  const sortBy = sortByOptions.includes(searchParams.sortBy as sortBy)
    ? (searchParams.sortBy as sortBy)
    : "updated_desc";
  const page =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;

  console.log(status, sortBy, search); // url shows status=private or public but here the value is still undefined
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
