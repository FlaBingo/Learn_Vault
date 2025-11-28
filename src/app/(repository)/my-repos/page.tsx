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
import { repoStatuses, repoStatus } from "@/drizzle/schema";
import { getRepositories } from "@/features/repo/actions/repo";
import FilterForm from "@/features/repo/components/FilterForm";
import PaginationControls from "@/features/repo/components/PaginationControls";
import RepoStructure from "@/features/repo/components/Repo";
import RepositoryList from "@/features/repo/components/RepositoryList";
import { sortBy, sortByOptions } from "@/lib/types/sorttypes";
import { auth } from "@/services/auth";
import { redirect, RedirectType } from "next/navigation";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RepositoriesPage({ searchParams }: Props) {
  const session = await auth();
  if (!session) {
    redirect("/login", RedirectType.replace);
  }
  const resolvedSearchParams = await searchParams;

  // extract the searchParams
  const search =
    typeof resolvedSearchParams?.search === "string"
      ? resolvedSearchParams?.search
      : undefined;
  const status = repoStatuses.includes(
    resolvedSearchParams?.status as repoStatus
  )
    ? (resolvedSearchParams?.status as repoStatus)
    : undefined; // this f*cking line wasted my 4 hours
  const sortBy = sortByOptions.includes(resolvedSearchParams?.sortBy as sortBy)
    ? (resolvedSearchParams?.sortBy as sortBy)
    : "updated_desc";
  const page =
    typeof resolvedSearchParams?.page === "string"
      ? Number(resolvedSearchParams?.page)
      : 1;
  const response = await getRepositories({ search, status, sortBy, page });
  const { data: repos, pagination } = response;

  return (
    <>
      <RepositoryList repos={repos} pagination={pagination}/>
    </>
  );
}
