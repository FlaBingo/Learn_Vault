// src\app\(repository)\repo\[repoId]\page.tsx
import ContentCommentSection from "@/components/ContentCommentSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentBlockGroup from "@/features/content-block/components/ContentBlockGroup";
import ContentBlocks from "@/features/content-block/components/ContentBlocks";
import {
  getAnyRepoById,
  getRepoById,
  getUserByRepoId,
} from "@/features/repo/actions/repo";
import { auth } from "@/services/auth";

export default async function ContentPage({
  params,
}: {
  params: { repoId: string };
}) {
  const { repoId } = await params;
  
  const session = await auth();
  const logedUserId = session?.user?.id;
  
  const ownerUser = await getUserByRepoId(repoId);
  const repo = await getAnyRepoById(repoId);
  const { data } = repo;

  const owner = logedUserId === ownerUser?.id;
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
                    <BreadcrumbLink>{ownerUser?.name}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>Repository</BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>
                  {data?.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h1 className="text-5xl mt-7 mb-2 mx-3 font-bold">
          {data?.title}
        </h1>

        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-4 p-4">
            <Tabs defaultValue="content">
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="comment">Comment</TabsTrigger>
                <TabsTrigger value="setting">Settings</TabsTrigger>
                <TabsTrigger value="how-to">How to</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="my-2">
                <ContentBlockGroup userId={logedUserId}>
                  <ContentBlocks params={params} />
                </ContentBlockGroup>
              </TabsContent>
              <TabsContent value="comment" className="my-2">
                <ContentCommentSection />
              </TabsContent>
              <TabsContent value="setting" className="my-2">
                <Card>
                  <CardContent>
                    settings
                    changes to make:
                    - option for changing background color
                    - setting permission 
                      - if public : admin, editor
                      - if private: admin, editor, private viewer(may be premium)
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="how-to" className="my-2">
                <Card>
                  <CardContent>
                    How to
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div className="col-span-1 mt-14 p-2 sticky top-16 self-start">
            <div>
              <h2 className="font-bold mb-2 text-2xl">About</h2>
              <ul>
                <li>Creater: {ownerUser?.name}</li>
                <li>Status: {data?.status}</li>
              </ul>
            </div>
            <div>collaborators</div>
          </div>
        </div>
      </div>
    </>
  );
}
