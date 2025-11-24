import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

export default function ContentPageSkeleton() {
  return (
    <>
      <div className="container mx-auto mt-7">
        <Skeleton className="h-7 mb-4" />
        <div className="mx-3">
          <Skeleton className="h-12 w-60 mt-7 mb-2" />
          <Skeleton className="h-9 w-72 mt-6 mb-6" />
          <div className="grid grid-cols-5 gap-3">
            <Card className="backdrop-blur-lg col-span-full md:col-span-4">
            <CardContent className="min-h-[500px]">
              <Card className="h-52">
                <CardHeader className="overflow-hidden">
                  <CardTitle><Skeleton className="h-14 w-60"/></CardTitle>
                  <CardDescription><Skeleton className="h-10 w-72"/></CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Skeleton className="h-7 w-60"/>
                  <div className="flex gap-5 md:mr-6">
                    <Skeleton className="h-9 w-9"/>
                    <Skeleton className="h-9 w-9"/>
                  </div>
                </CardFooter>
              </Card>
              <Skeleton className="mt-7 h-9 rounded-2xl"/>
              <div className="h-56 opacity-0"></div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </>
  );
}
