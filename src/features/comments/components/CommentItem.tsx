// src/components/CommentItem.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/content-block-utils/date-formatter";

// Same type as in CommentList
type Comment = {
  id: string;
  text: string;
  author: {
    name: string;
    image: string;
  };
  createdAt: Date;
};

export default function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={comment.author.image} alt={comment.author.name} />
        <AvatarFallback>
          {comment.author.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{comment.author.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>
        {/* Use whitespace-pre-wrap to respect line breaks in the comment */}
        <div className="text-sm whitespace-pre-wrap mt-1">{comment.text}</div>
        
        {/* Optional: Add reply/like buttons here */}
        {/* <div className="flex gap-2 text-xs mt-1">
          <Button variant="ghost" size="xs">Like</Button>
          <Button variant="ghost" size="xs">Reply</Button>
        </div> */}
      </div>
    </div>
  );
}