import MyRepoSkeleton from "@/components/skeletons/MyRepoSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="container mx-auto mt-7 px-6">
        <MyRepoSkeleton />
      </div>
    </>
  );
}
