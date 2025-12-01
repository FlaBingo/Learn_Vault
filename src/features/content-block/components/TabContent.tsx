import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestCollab from "@/features/repo/components/RequestCollab";
import { ContentModalProvider } from "./ContentModalContext";
import ContentBlockGroup from "./ContentBlockGroup";
import ContentBlocks from "./ContentBlocks";
import CommentSection from "@/features/comments/components/CommentSection";
import SettingsSection from "@/components/SettingsSection";
import HowtoSection from "@/components/HowtoSection";
import AboutRepo from "@/components/AboutRepo";
import { metadata } from "@/app/layout";
import { collaboratorRole } from "@/drizzle/schema";
import { Card, CardContent } from "@/components/ui/card";

type TabContentProps = {
  repoId: string;
  logedUserId: string | undefined;
  owner: boolean;
  role: collaboratorRole | undefined;
  ownerUser: {
    name: string;
    image: string | null;
    id: string;
    email: string;
    isVerified: boolean;
    emailVerified: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  data:
    | {
        title: string;
        description: string | null;
        id: string;
        status: "private" | "public";
        userId: string;
        createdAt: Date;
        updatedAt: Date;
      }
    | null
    | undefined;
  parentId?: string;
  slug?: string[] | undefined;
};

export default async function TabContent({
  parentId,
  slug,
  logedUserId,
  owner,
  role,
  ownerUser,
  repoId,
  data,
}: TabContentProps) {
  metadata.title = data?.title;
  metadata.description = data?.description;

  return (
    <>
      <div className="grid grid-cols-5 gap-3 relative">
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
              <TabsTrigger value="about" className="md:hidden">
                About
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="my-2">
              {!role && !owner && data?.status === "private" ? (
                <RequestCollab name={ownerUser?.name} repoName={data.title} />
              ) : (
                <ContentModalProvider>
                  <ContentBlockGroup
                    userId={logedUserId}
                    role={role}
                    owner={owner}
                  >
                    {parentId ? (
                      <ContentBlocks params={{ repoId, parentId, slug }} />
                    ) : (
                      <ContentBlocks params={{ repoId }} />
                    )}
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
                  <AboutRepo ownerUser={ownerUser} repo={data} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="col-span-1 mt-14 p-2 sticky top-16 self-start hidden md:block">
          <AboutRepo ownerUser={ownerUser} repo={data} />
        </div>
      </div>
    </>
  );
}
