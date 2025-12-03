// src\features\user\components\UserProfile.tsx

import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Users,
  Star,
  GitFork,
  Bookmark,
  MoreVertical,
  ShieldAlert,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/services/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { emailToUsername } from "@/lib/user-utils/utils";
import { formatCreateDate } from "@/lib/content-block-utils/date-formatter";

// Import Server Actions
import {
  getUserCollabRepos,
  getUserSavedRepos,
} from "@/features/user/actions/userAction";
import { getCommentsByUserId } from "@/features/comments/actions/comments";
import Link from "next/link";

type UserProfilePageProps = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  description: string | null;
  location: string | null;
  website: string | null;
  isVerified: boolean;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default async function UserProfilePage({
  userData,
}: {
  userData: UserProfilePageProps;
}) {
  const session = await auth();
  const loggedInUser = session?.user;

  const isOwner = loggedInUser?.id === userData.id;

  const userImage = userData.image ? userData.image : "/favicon.png";
  const userEmail = userData.email ? userData.email : "example@gmail.com";

  const collabRepos = await getUserCollabRepos(userData.id);
  const savedRepos = await getUserSavedRepos(userData.id);
  const myComments = await getCommentsByUserId(userData.id);

  return (
    <div className="container max-w-5xl py-10 mx-auto">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 px-5">
        <div className="flex-shrink-0">
          <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
            <AvatarImage src={userImage} />
            <AvatarFallback>
              {userData.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {userData.name}
              {/* Optional: Show an "Owner" badge if viewing your own profile */}
              {isOwner && (
                <Badge variant="secondary" className="text-xs">
                  You
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              @{emailToUsername(userEmail)}
            </p>
          </div>

          <p className="text-sm md:text-base leading-relaxed max-w-2xl">
            {userData.description || "No bio provided."}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {userData.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {userData.location}
              </div>
            )}
            {userData.website && (
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <a
                  href={userData.website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline hover:text-primary"
                >
                  {userData.website}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Joined{" "}
              {formatCreateDate(userData.createdAt.toString())}
            </div>
          </div>
        </div>

        <div className="flex md:flex-col gap-3">
          {isOwner && <Button>Edit Profile</Button>}
          <Button variant="outline">Share</Button>
        </div>
      </div>

      <Separator className="my-6" />

      {/* --- Main Content Area --- */}
      <Tabs
        defaultValue="collaborating"
        className="w-full overflow-hidden mx-2"
      >
        <TabsList className="mb-6 overflow-auto w-full justify-start">
          <TabsTrigger value="collaborating" className="gap-2">
            <GitFork className="w-4 h-4" /> Appears In
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-2">
            <Star className="w-4 h-4" /> Saved
          </TabsTrigger>

          {/* Protected Tabs: Only visible to Owner */}
          {
            <>
              <TabsTrigger value="collaborators" className="gap-2">
                <Users className="w-4 h-4" /> Team Management
              </TabsTrigger>
              <TabsTrigger value="comments" className="gap-2">
                <Bookmark className="w-4 h-4" /> My Comments
              </TabsTrigger>
            </>
          }
        </TabsList>

        {/* --- Tab 1: Collaborating (Repos user is working on) --- */}
        <TabsContent value="collaborating">
          {collabRepos.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No collaborations found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collabRepos.map((item) => (
                <Card key={item.repo.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-base truncate">
                        {item.repo.title}
                      </CardTitle>
                      <Badge
                        variant={
                          item.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {item.role}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-1">
                      {item.repo.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      Joined: {formatCreateDate(item.joinedAt.toString())}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {item.repo.status ? "Public" : "Private"}
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* --- Tab 2: Saved Repos --- */}
        <TabsContent value="saved">
          {savedRepos.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No saved repositories.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedRepos.map((item) => (
                <Card
                  key={item.repo.id}
                  className="group hover:shadow-md transition-all"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                        {item.repo.title}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                    <CardDescription>Created by Author</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {item.repo.description}
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground border-t bg-muted/20 pt-3">
                    Saved {formatCreateDate(item.savedAt.toString())}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* --- Tab 3: Team Management (OWNER ONLY) --- */}
        {
          <TabsContent value="collaborators">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  People managing repositories you own.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-10 text-center border-2 border-dashed rounded-lg text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-4 opacity-20" />
                  <p>You haven&apos;t created any shared repositories yet.</p>
                  <Button variant="link" className="mt-2">
                    Create a Repository
                  </Button>
                </div>
                {/* NOTE: To fully implement this list, we need a new DB function:
                   `getCollaboratorsAcrossAllMyRepos(userId)`
                   For now, showing a placeholder state.
                */}
              </CardContent>
            </Card>
          </TabsContent>
        }

        {/* --- Tab 4: Comments (OWNER ONLY) --- */}
        {
          <TabsContent value="comments">
            <div className="space-y-4">
              {myComments.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">
                  No comments yet.
                </div>
              ) : (
                myComments.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="">
                      <CardDescription>
                        Commented on{" "}
                        <span className="font-semibold text-foreground">
                            <Link href={`/repo/${item.repo.id}`} className="cursor-pointer hover:underline">
                              {item.repo.title}
                            </Link>
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="my-[-15px]">
                      <div className="text-sm">{item.content}</div>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground">
                      {formatCreateDate(item.createdAt.toString())}
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        }
      </Tabs>
    </div>
  );
}
