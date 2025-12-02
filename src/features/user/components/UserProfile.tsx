import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Layers,
  Users,
  Star,
  GitFork,
  BookOpen,
  Bookmark,
  MoreVertical,
  ShieldAlert,
  ExternalLink,
  Trash2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/services/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Data representing a joined query of User + Repo + Tags
const profileData = {
  user: {
    name: "Satyam",
    handle: "@satyam_dev",
    bio: "Full Stack Developer. Building LearnVault to organize the internet's best resources. MERN & Next.js enthusiast.",
    location: "Pune, India",
    website: "satyam.dev",
    joined: "May 2025",
    avatarUrl: "https://github.com/shadcn.png", // Placeholder
  },
  stats: {
    vaults: 12,
    contributions: 45,
    followers: 120,
  },
  repos: [
    {
      id: 1,
      title: "Next.js Mastery",
      description: "A curated collection of the best Next.js 14 tutorials, blogs, and official docs.",
      isPrivate: false,
      tags: ["NextJS", "React", "Frontend"],
      resourceCount: 42,
      updatedAt: "2 days ago",
    },
    {
      id: 2,
      title: "System Design Patterns",
      description: "PDFs and diagrams explaining complex distributed system architectures.",
      isPrivate: true,
      tags: ["Backend", "Architecture"],
      resourceCount: 15,
      updatedAt: "1 week ago",
    },
    {
      id: 3,
      title: "DevOps Pipeline",
      description: "Scripts and videos for setting up CI/CD with Docker and Kubernetes.",
      isPrivate: false,
      tags: ["DevOps", "Docker"],
      resourceCount: 8,
      updatedAt: "1 month ago",
    },
  ],
  collabs: [
    {
      id: 4,
      title: "Hackathon Resources",
      owner: "Alice_doe",
      role: "Editor",
      updatedAt: "3 hours ago",
    }
  ]
};
// --- Mock Data ---

// 1. Repos the user has SAVED (from 'savedRepos' table)
const savedVaults = [
  {
    id: 101,
    title: "Advanced Rust Patterns",
    owner: "alex_rs",
    description: "Deep dive into memory safety and concurrency patterns.",
    tags: ["Rust", "Systems"],
    savedAt: "2 days ago",
  },
  {
    id: 102,
    title: "Machine Learning Ops",
    owner: "data_wizard",
    description: "From notebook to production. MLOps best practices.",
    tags: ["Python", "AI", "DevOps"],
    savedAt: "1 week ago",
  },
];

// 2. People collaborating on MY repos (Query: 'collaborator' table joined with 'repo' where repo.ownerId = me)
const myCollaborators = [
  {
    userId: "u_1",
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?u=alice",
    repoName: "Next.js Mastery", // The repo of yours they are working on
    role: "Editor", // Their permission level
    joinedAt: "Jan 10, 2025",
  },
  {
    userId: "u_2",
    name: "Bob Smith",
    avatar: "https://i.pravatar.cc/150?u=bob",
    repoName: "Next.js Mastery",
    role: "Viewer", 
    joinedAt: "Feb 14, 2025",
  },
  {
    userId: "u_3",
    name: "Charlie Dev",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    repoName: "System Design Patterns",
    role: "Admin",
    joinedAt: "Mar 01, 2025",
  },
];



export default async function UserProfilePage() {
  return (
    <div className="container max-w-5xl py-10 mx-auto">
      
      {/* --- 1. Header Section (Schema: user, accounts) --- */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-shrink-0">
          <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
            <AvatarImage src={profileData.user.avatarUrl} />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{profileData.user.name}</h1>
            <p className="text-muted-foreground">{profileData.user.handle}</p>
          </div>
          
          <p className="text-sm md:text-base leading-relaxed max-w-2xl">
            {profileData.user.bio}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {profileData.user.location}
            </div>
            <div className="flex items-center gap-1">
              <LinkIcon className="w-4 h-4" /> 
              <a href="#" className="hover:underline hover:text-primary">{profileData.user.website}</a>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Joined {profileData.user.joined}
            </div>
          </div>
        </div>

        <div className="flex md:flex-col gap-3">
          <Button>Edit Profile</Button>
          <Button variant="outline">Share</Button>
        </div>
      </div>

      <Separator className="my-6" />

      {/* --- 2. Main Content Area --- */}
      <Tabs defaultValue="vaults" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="collaborating" className="gap-2">
            <Users className="w-4 h-4" />My Collaborations
          </TabsTrigger>
          <TabsTrigger value="collaborators" className="gap-2">
            <Users className="w-4 h-4" />My Collaborators
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-2">
            <Star className="w-4 h-4" /> Saved
          </TabsTrigger>
          <TabsTrigger value="comments" className="gap-2">
            <Star className="w-4 h-4" /> My Comments
          </TabsTrigger>
        </TabsList>

        {/* --- Tab: Collaborations (Schema: collaborator, repo) --- */}
        <TabsContent value="collaborating">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileData.collabs.map((collab) => (
              <Card key={collab.id}>
                <CardHeader>
                  <CardTitle className="text-base">{collab.title}</CardTitle>
                  <CardDescription>Owner: {collab.owner}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Badge variant="outline"><GitFork className="w-3 h-3 mr-1"/> {collab.role}</Badge>
                  <span className="text-xs text-muted-foreground">{collab.updatedAt}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedVaults.map((repo) => (
              <Card key={repo.id} className="group hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {repo.title}
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                       <Bookmark className="w-4 h-4 fill-current" /> {/* Filled because it is saved */}
                    </Button>
                  </div>
                  <CardDescription>by @{repo.owner}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {repo.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {repo.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground border-t bg-muted/20 pt-3">
                  Saved {repo.savedAt}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>


        {/* --- TAB: INCOMING COLLABORATORS --- */}
        <TabsContent value="collaborators">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                People who have access to repositories you own.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {myCollaborators.map((collab, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      
                      {/* User Info */}
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={collab.avatar} />
                          <AvatarFallback>{collab.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">{collab.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Collaborating on <span className="text-primary font-medium">{collab.repoName}</span>
                          </p>
                        </div>
                      </div>

                      {/* Role & Actions */}
                      <div className="flex items-center gap-4">
                        <Badge variant={collab.role === 'Admin' ? 'default' : 'secondary'}>
                          {collab.role}
                        </Badge>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <ShieldAlert className="w-4 h-4 mr-2" /> Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                               <ExternalLink className="w-4 h-4 mr-2" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" /> Remove Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}