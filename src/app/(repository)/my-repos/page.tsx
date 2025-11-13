// src\app\(repository)\my-repos\page.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { getRepositories } from "@/features/repo/actions/repo";
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
  if (!session) {
    redirect("/login", RedirectType.replace);
  }

  const resolvedSearchParams = searchParams;

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
  const response = await getRepositories({ search, status, sortBy, page });
  const { data: repos, pagination } = response;

  return (
    <>
      <div>
        <Breadcrumb className="px-4 py-1 mb-4 bg-accent rounded-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>my repositories</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
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
            repos.map((repo, index) => (
              <div
                key={repo.id}
                className={`py-5 px-5 transition-colors ${
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800" // bright for light mode, darker for dark mode
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                <RepoStructure {...repo} />
              </div>
            ))
          ) : (
            <div>No repositories found.</div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <PaginationControls pagination={pagination} />
        </CardFooter>
      </Card>
    </>
  );
}
