// src\components\CommentSection.tsx

// src/components/CommentSection.tsx
// import { Separator } from "./ui/separator";
// import CommentInput from "./CommentInput";
// import CommentList from "./CommentList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommentInput from "./CommentInput";
import { Separator } from "@/components/ui/separator";
import CommentList from "./CommentList";
// import { getCommentsForRepo } from "@/lib/db/queries";

// --- Mock Data ---
const mockComments = [
  {
    id: "1",
    text: "This is the first comment! Great repository.",
    author: {
      name: "Satyam",
      image: "https://github.com/shadcn.png", // Placeholder image
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: "2",
    text: "Thanks for putting this together. The video on Next.js server actions was super helpful.",
    author: {
      name: "Jane Doe",
      image: "https://github.com/shadcn.png", // Placeholder image
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
];
// --- End Mock Data ---

export default async function CommentSection({ repoId }: { repoId: string }) {
  // 1. Fetch comments from your database
  // const comments = await getCommentsForRepo(repoId);
  
  // Using mock comments for now
  const comments = mockComments;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments ({comments.length}) (Incomplete)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CommentInput repoId={repoId} />
        <Separator />
        <CommentList comments={comments} />
      </CardContent>
    </Card>
  );
}