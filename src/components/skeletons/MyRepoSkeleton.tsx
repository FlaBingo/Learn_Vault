import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default async function MyRepoSkeleton() {
  return (
    <>
      <div>
        <Skeleton className="h-7 mb-4" />
      </div>
      <div>
        <Skeleton className="h-8 mb-4" />
      </div>

      <Card className="my-5">
        <CardHeader>
          <CardTitle><Skeleton className="h-7 w-32 rounded-lg"/></CardTitle>
          <CardDescription><Skeleton className="h-5 w-40 rounded-lg"/></CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32"/>
        </CardContent>
      </Card>
    </>
  );
}
