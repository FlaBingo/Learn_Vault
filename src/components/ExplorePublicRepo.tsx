import FilterForm from "@/features/repo/components/FilterForm";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import RepoStructure from "@/features/repo/components/Repo";
import { Separator } from "./ui/separator";

export default async function ExplorePublicRepos() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Explore</CardTitle>
          <CardDescription>Public repositories</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>
          <FilterForm mode="explore" />
          {repos.length > 0 ? (
            repos.map((repo) => (
              <div key={repo.id}>
                <RepoStructure {...repo} />
                <Separator className="my-4" />
              </div>
            ))
          ) : (
            <p>No repositories found.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
