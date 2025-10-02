import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getRepos } from "@/features/repo/actions/repo";
import RepoStructure from "@/features/repo/components/Repo";
import { auth } from "@/services/auth";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id
  const response = await getRepos({userId});
  // console.log(response)
  return (
    <>
      <div className="flex gap-2">
        <Input placeholder="Find a repository..." />
        <Select>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Type</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort</SelectLabel>
              <SelectItem value="last-updated">last updated</SelectItem>
              <SelectGroup>
                <SelectLabel>alphabetical</SelectLabel>
                <SelectItem value="ascending">ascending</SelectItem>
                <SelectItem value="descending">descending</SelectItem>
              </SelectGroup>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Card className="my-5">
        <CardHeader>
          <CardTitle>Your Repositories</CardTitle>
          <CardDescription>description</CardDescription>
        </CardHeader>
        <CardContent>
          {response.map((repo) => (
            <div key={repo.id}>  
              <RepoStructure {...repo}/>
              <Separator className="my-4"/>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button variant={"ghost"}>
            <ChevronLeft />
            Previous
          </Button>
          <Button variant={"ghost"}>
            Next
            <ChevronRight />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
