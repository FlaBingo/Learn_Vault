import { Loader2 } from "lucide-react";

// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin"/>
      {/* You can also use a spinner, skeleton, or other loading indicators here */}
    </div>
  );
}