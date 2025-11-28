import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import FilterForm from "./FilterForm";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RepoStructure from "./Repo";
import PaginationControls from "./PaginationControls";
import { RepoTable } from "@/drizzle/schema";
import { modeType } from "@/lib/types/sorttypes";

type RepositoryListProps = {
  repos: {
    id: string;
    title: string;
    description: string | null;
    status: "public" | "private";
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
};
  mode?: modeType;
}

export default async function RepositoryList({repos, pagination, mode}: RepositoryListProps) {
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
              <BreadcrumbLink href="/repo">Repository</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {(mode !== "all") && <BreadcrumbItem>
              <BreadcrumbLink>My repositories</BreadcrumbLink>
            </BreadcrumbItem>}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
        <FilterForm />
      </div>

      <Card className="my-5">
        <CardHeader>
          <CardTitle>{mode === "all" ? "All ": "My "} repositories</CardTitle>
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
                    ? ""
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <RepoStructure {...repo} mode={mode}/>
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
