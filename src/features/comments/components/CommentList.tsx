// src/components/CommentList.tsx

import CommentItem from "./CommentItem";


// Define the type for a comment based on mock data
// You should replace this with your actual Drizzle/Prisma type
type Comment = {
  id: string;
  text: string;
  author: {
    name: string;
    image: string;
  };
  createdAt: Date;
};

export default function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}