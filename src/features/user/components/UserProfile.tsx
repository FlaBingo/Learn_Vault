import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Layers,
  Users,
  Star,
  GitFork,
  BookOpen
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/services/auth";

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
          <TabsTrigger value="vaults" className="gap-2">
            <Layers className="w-4 h-4" /> My Vaults
          </TabsTrigger>
          <TabsTrigger value="collaborations" className="gap-2">
            <Users className="w-4 h-4" /> Collaborating
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-2">
            <Star className="w-4 h-4" /> Saved
          </TabsTrigger>
        </TabsList>

        {/* --- Tab: My Vaults (Schema: repo, tags, contentBlock) --- */}
        <TabsContent value="vaults">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profileData.repos.map((repo) => (
              <Card key={repo.id} className="hover:border-primary/50 transition-colors cursor-pointer flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {repo.isPrivate ? <span className="text-muted-foreground">🔒</span> : <BookOpen className="w-4 h-4 text-blue-500"/>}
                      {repo.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2 h-10">
                    {repo.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {repo.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="text-xs text-muted-foreground border-t bg-muted/10 pt-3 flex justify-between">
                  <span>{repo.resourceCount} Resources</span>
                  <span>Updated {repo.updatedAt}</span>
                </CardFooter>
              </Card>
            ))}
            
            {/* Create New Vault Placeholder */}
            <Button variant="outline" className="h-full min-h-[200px] border-dashed flex flex-col gap-2 text-muted-foreground hover:text-primary hover:border-primary">
              <Layers className="w-8 h-8" />
              <span>Create New Vault</span>
            </Button>
          </div>
        </TabsContent>

        {/* --- Tab: Collaborations (Schema: collaborator, repo) --- */}
        <TabsContent value="collaborations">
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
      </Tabs>
    </div>
  );
}