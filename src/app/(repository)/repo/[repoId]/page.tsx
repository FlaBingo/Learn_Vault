// src\app\(repository)\repo\[repoId]\page.tsx

import ScrollButtons from "@/components/ScrollButtons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { collaboratorRole } from "@/drizzle/schema";
import { userRepoRole } from "@/features/content-block/actions/content-block";
import { getAnyRepoById, getUserByRepoId } from "@/features/repo/actions/repo";
import { auth } from "@/services/auth";
import { emailToUsername } from "@/lib/user-utils/utils";
import TabContent from "@/features/content-block/components/TabContent";

export default async function ContentPage({
  params,
}: {
  params: Promise<{ repoId: string }>;
}) {
  const { repoId } = await params;

  const session = await auth();
  const logedUserId = session?.user?.id;
  
  const ownerUser = await getUserByRepoId(repoId);
  const repo = await getAnyRepoById(repoId);
  const { data } = repo;

  let role: collaboratorRole | undefined;
  if (logedUserId) {
    role = (await userRepoRole(logedUserId, repoId)).data?.role;
  }

  const username = emailToUsername(ownerUser?.email);

  const owner = !!logedUserId && logedUserId === ownerUser?.id;
  return (
    <>
      <div className="container mx-auto mt-7 relative overflow-hidden">
        <div>
          <Breadcrumb className="px-4 py-1 mb-3 bg-accent rounded-sm">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {owner ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/my-repos">
                      my repositories
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              ) : (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={logedUserId ? `/profile/${username}` : `/login`}
                    >
                      {username}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{data?.title}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h1 className="text-5xl mt-7 mb-2 mx-3 font-bold">{data?.title}</h1>

        <TabContent logedUserId={logedUserId} role={role} owner={owner} repoId={repoId} data={data} ownerUser={ownerUser} />

        <ScrollButtons />
      </div>
    </>
  );
}
