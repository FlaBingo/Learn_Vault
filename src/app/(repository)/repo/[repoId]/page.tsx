import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ContentBlockGroup from "@/features/content-block/components/ContentBlockGroup";
import { getAnyRepoById, getRepoById, getUserByRepoId } from "@/features/repo/actions/repo";

export default async function ContentPage({
  params,
}: {
  params: { repoId: string };
}) {
  const { repoId } = await params;
  const repo = await getRepoById(repoId);
  const user = await getUserByRepoId(repoId);
  const { data } = repo;
  const publicRepo = await getAnyRepoById(repoId);
  const { data : publicData } = publicRepo;
  const owner = repo?.data?.userId === user?.id;
  return (
    <>
      <div className="container mx-auto mt-7">
        <div>
          <Breadcrumb className="px-4 py-1 mb-3 bg-accent rounded-sm">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {owner ? (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/my-repos">
                      my repositories
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              ) : (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      Repository
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      {user?.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{publicData?.title || data?.title}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h1 className="text-5xl my-7 font-bold">{publicData?.title || data?.title}</h1>
        <div className="grid grid-cols-5 gap-4 relative">
          <div className="col-span-4 p-4">
            <ContentBlockGroup />
          </div>
          <div className="col-span-1 p-2 sticky top-0">
            <div>
              <h2 className="font-bold mb-2 text-2xl">About</h2>
              <ul>
                <li>Creater: {user?.name}</li>
                <li>Status: {publicData?.status || data?.status}</li>
              </ul>
            </div>
            <div>collaborators</div>
          </div>
        </div>
      </div>
    </>
  );
}
