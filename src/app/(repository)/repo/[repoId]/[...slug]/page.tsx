// src\app\(repository)\repo\[repoId]\[...slug]\page.tsx

import ScrollButtons from "@/components/ScrollButtons";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collaboratorRole } from "@/drizzle/schema";
import {
  getFolderById,
  userRepoRole,
} from "@/features/content-block/actions/content-block";
import ContentBlockGroup from "@/features/content-block/components/ContentBlockGroup";
import ContentBlocks from "@/features/content-block/components/ContentBlocks";
import { ContentModalProvider } from "@/features/content-block/components/ContentModalContext";
import { getAnyRepoById, getUserByRepoId } from "@/features/repo/actions/repo";
import { auth } from "@/services/auth";
import Link from "next/link";
import CommentSection from "@/features/comments/components/CommentSection";
import HowtoSection from "@/components/HowtoSection";
import SettingsSection from "@/components/SettingsSection";
import { metadata } from "@/app/layout";
import { emailToUsername } from "@/lib/user-utils/utils";
import AboutRepo from "@/components/AboutRepo";
import { Card, CardContent } from "@/components/ui/card";
import RequestCollab from "@/features/repo/components/RequestCollab";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ repoId: string; slug: string[] }>;
}) {
  const { repoId, slug } = await params;
  const parentId = slug[slug.length - 1];

  const session = await auth();
  const logedUserId = session?.user?.id;

  const ownerUser = await getUserByRepoId(repoId);
  const repo = await getAnyRepoById(repoId);
  const { data } = repo;
  metadata.title = data?.title;
  metadata.description = data?.description;
  const owner = !!logedUserId && logedUserId === ownerUser?.id;

  let role: collaboratorRole | undefined;
  if (logedUserId) {
    role = (await userRepoRole(logedUserId, repoId)).data?.role;
  }
  const username = emailToUsername(ownerUser?.email);
  const folderPromises = slug.map((folderId) => getFolderById(folderId));
  const resolvedFolders = await Promise.all(folderPromises);
  // --- End of FIX 1 ---

  return (
    <>
      <div className="container mx-auto mt-7">
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
                <BreadcrumbLink href={`/repo/${data?.id}`}>
                  {data?.title}
                  {" (repo)"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {slug.length > 0 && (
                <>
                  <BreadcrumbSeparator />
                  {slug.length > 1 && (
                    <>
                      <BreadcrumbItem>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer">
                            <BreadcrumbEllipsis className="size-4" />
                            <span className="sr-only">Toggle menu</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {/* --- FIX 2: Corrected Dropdown Logic --- */}
                            {resolvedFolders.map((folder, index) => {
                              // Only show items *before* the last one in the dropdown
                              if (index === resolvedFolders.length - 1)
                                return null;

                              // Create the correct path by slicing the original slug array
                              // This is non-mutating and creates the correct incremental path
                              const dropdownList = slug
                                .slice(0, index + 1)
                                .join("/");

                              return (
                                <Link
                                  key={folder.data?.id}
                                  href={`/repo/${repoId}/${dropdownList}`}
                                >
                                  <DropdownMenuItem>
                                    {folder.data?.content}
                                  </DropdownMenuItem>
                                </Link>
                              );
                            })}
                            {/* --- End of FIX 2 --- */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  )}
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      {/* --- FIX 3: Use the resolved array --- */}
                      {
                        resolvedFolders[resolvedFolders.length - 1].data
                          ?.content
                      }
                      {/* --- End of FIX 3 --- */}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h1 className="text-5xl mt-7 mb-2 mx-3 font-bold">
          {slug
            ? resolvedFolders[resolvedFolders.length - 1].data?.content
            : data?.title}
        </h1>

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
                {(logedUserId && data?.status === "private") ? (
                  <RequestCollab name={ownerUser?.name}/>
                ) : (
                  <ContentModalProvider>
                    <ContentBlockGroup
                      userId={logedUserId}
                      role={role}
                      owner={owner}
                    >
                      <ContentBlocks params={{ repoId, parentId, slug }} />
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
                <Card>
                  <CardContent>
                    <AboutRepo name={ownerUser?.name} status={data?.status} />
                  </CardContent>
                </Card>
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
