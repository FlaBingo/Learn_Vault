// src/components/ExplorePublicRepo.tsx

import FilterForm from "@/features/repo/components/FilterForm";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import RepoStructure from "@/features/repo/components/Repo";
import { Separator } from "./ui/separator";
import { getRepositories, GetReposParams } from "@/features/repo/actions/repo";
import { sortBy } from "@/lib/types/sorttypes";
import { repoStatus } from "@/lib/types/repoTypes";
import PaginationControls from "@/features/repo/components/PaginationControls";

export default async function ExplorePublicRepos({
  searchParams,
}: {
  searchParams: {
    search?: string;
    sortBy?: string;
    page?: string;
  };
}) {
  // Parse params from the URL, providing defaults
  const params: GetReposParams = {
    search: searchParams.search || undefined,
    // status: (searchParams.status as repoStatus) || undefined, // Add type assertion
    sortBy: (searchParams.sortBy as sortBy) || undefined,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    mode: "explore",
  };

  const response = await getRepositories(params);
  const { data: repos, pagination } = response;
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Explore Public repositories</CardTitle>
          <CardDescription>
            Showing {repos.length} of {pagination.totalCount} repositories.
          </CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>
          <FilterForm mode="explore" />
          <div className="my-4"></div>
          <div className="mx-1">
            {repos.length > 0 ? (
              repos.map((repo) => (
                <div key={repo.id}>
                  <RepoStructure {...repo} mode="explore" />
                  <Separator className="my-4" />
                </div>
              ))
            ) : (
              <div>No repositories found.</div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <PaginationControls pagination={pagination} />
        </CardFooter>
      </Card>
    </>
  );
}
