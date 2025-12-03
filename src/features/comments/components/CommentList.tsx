// src/components/CommentList.tsx

import { auth } from "@/services/auth";
import CommentItem from "./CommentItem";

// Define the type for a comment based on mock data
// You should replace this with your actual Drizzle/Prisma type
type CommentProp =
  | {
      id: string;
      content: string;
      repoId: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      user: {
        name: string;
        image: string | null;
        id: string;
      } | null;
    }[] | undefined;

export default async function CommentList({ comments }: { comments: CommentProp }) {
  const session = await auth();
  const logedInUserId = session?.user?.id;
  let access = false;
  if (!comments || comments.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-auto pb-5">
      {comments.map((comment) => {
        access = logedInUserId === comment.userId;
        return (
        <CommentItem key={comment.id} comment={comment} access={access}/>
      )})}
    </div>
  );
}
