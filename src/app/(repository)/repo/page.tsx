import { repoStatus } from "@/drizzle/schema";
import { getRepositories, GetReposParams } from "@/features/repo/actions/repo";
import RepositoryList from "@/features/repo/components/RepositoryList";
import { repoStatuses } from "@/lib/types/repoTypes";
import { sortBy, sortByOptions } from "@/lib/types/sorttypes";
import { auth } from "@/services/auth";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function AllRepoPage({ searchParams }: Props) {
  const session = await auth();
  const userId = session?.user?.id;
  if(!userId){
    redirect("/login");
  }
  const params = await searchParams;
  
  const repoParams: GetReposParams = {
    search: typeof params.search === "string" ? params.search : undefined,
    status: repoStatuses.includes(params.status as repoStatus) ? (params.status as repoStatus) : undefined,
    sortBy: sortByOptions.includes(params.sortBy as sortBy) ? (params.sortBy as sortBy) : "updated_desc",
    page: typeof params.page === "string" ? Number(params.page) : 1,
    mode: "all",
  };

  const response = await getRepositories(repoParams);
  const { data: repos, pagination } = response;
  return (
    <>
      <div className="container mx-auto mt-7 px-6">
        <RepositoryList repos={repos} pagination={pagination} mode="all" />
      </div>
    </>
  );
}
