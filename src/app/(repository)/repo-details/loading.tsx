import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="container mx-auto">
        <Skeleton className="h-7 mb-4 mt-7" />
      </div>
    </>
  );
}
