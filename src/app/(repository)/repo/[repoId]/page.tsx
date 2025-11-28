// src\app\(repository)\repo\[repoId]\page.tsx
import CommentSection from "@/features/comments/components/CommentSection";
import HowtoSection from "@/components/HowtoSection";
import ScrollButtons from "@/components/ScrollButtons";
import SettingsSection from "@/components/SettingsSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collaboratorRole } from "@/drizzle/schema";
import { userRepoRole } from "@/features/content-block/actions/content-block";
import ContentBlockGroup from "@/features/content-block/components/ContentBlockGroup";
import ContentBlocks from "@/features/content-block/components/ContentBlocks";
import { ContentModalProvider } from "@/features/content-block/components/ContentModalContext";
import { getAnyRepoById, getUserByRepoId } from "@/features/repo/actions/repo";
import { auth } from "@/services/auth";
import { metadata } from "@/app/layout";
import { emailToUsername } from "@/lib/user-utils/utils";
import AboutRepo from "@/components/AboutRepo";
import { SessionProvider } from "next-auth/react";
import RequestCollab from "@/features/repo/components/RequestCollab";

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

  metadata.title = data?.title;
  metadata.description = data?.description;

  let role: collaboratorRole | undefined;
  if (logedUserId) {
    role = (await userRepoRole(logedUserId, repoId)).data?.role;
  }

  const username = emailToUsername(ownerUser?.email);

  const owner = !!logedUserId && logedUserId === ownerUser?.id;
  return (
    <>
      <div className="container mx-auto mt-7 relative">
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

        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-full md:col-span-4 p-4">
            <Tabs defaultValue="content">
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                {(owner || role) && (
                  <TabsTrigger value="comment">Comment</TabsTrigger>
                )}
                {(owner || role === "admin") && (
                  <TabsTrigger value="setting">Settings</TabsTrigger>
                )}
                <TabsTrigger value="how-to">How to</TabsTrigger>
                <TabsTrigger value="about" className="md:hidden">About</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="my-2">
                {logedUserId && data?.status === "private" ? (
                  <RequestCollab name={ownerUser?.name}/>
                ) : (
                  <ContentModalProvider>
                    <ContentBlockGroup
                      userId={logedUserId}
                      role={role}
                      owner={owner}
                    >
                      <ContentBlocks params={{ repoId }} />
                    </ContentBlockGroup>
                  </ContentModalProvider>
                )}
              </TabsContent>
              <TabsContent value="comment" className="my-2">
                <CommentSection repoId={repoId} />
              </TabsContent>
              <TabsContent value="setting" className="my-2">
                <SettingsSection />
              </TabsContent>
              <TabsContent value="how-to" className="my-2">
                <HowtoSection />
              </TabsContent>
              <TabsContent value="about" className="my-2 md:hidden">
                <AboutRepo name={ownerUser?.name} status={data?.status} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="col-span-1 mt-14 p-2 sticky top-16 self-start hidden md:block">
            <AboutRepo name={ownerUser?.name} status={data?.status} />
          </div>
        </div>
        <ScrollButtons />
      </div>
    </>
  );
}
