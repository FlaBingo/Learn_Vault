// src\features\comments\components\CommentItem.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatTimeAgo } from "@/lib/content-block-utils/date-formatter";
import { Loader2, Trash2 } from "lucide-react";
import { MouseEvent, useEffect, useRef, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { deleteCommentAction } from "../actions/comments";
import MarkdownFormatter from "@/features/content-block/components/MarkdownFormatter";

type Comment = {
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
};

interface CommentItemProps {
  comment: Comment;
  access: boolean;
}
const MAX_CLAMP_HEIGHT_PX = 60;

export default function CommentItem({ comment, access }: CommentItemProps) {

  const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const contentWrapperRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const element = contentWrapperRef.current;
      if (element) {
        if (element.scrollHeight > MAX_CLAMP_HEIGHT_PX) {
          setIsOverflowing(true);
        } else {
          setIsOverflowing(false);
        }
      }
    }, [comment]);


  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  // Safe user fallbacks
  const userName = comment.user?.name || "Unknown User";
  const userImage = comment.user?.image || "";
  const userInitials = userName.substring(0, 2).toUpperCase();

  const handleDeleteComment = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    startTransition(async () => {
      try {
        const result = await deleteCommentAction(
          comment.id,
          comment.repoId,
          pathname
        );

        if (!result.success) {
          toast.error(result.error || "Failed to delete comment");
        } else {
          toast.success("Comment deleted");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <div className="flex gap-4 group items-start py-3 animate-in fade-in duration-300">
      <Avatar className="h-8 w-8 cursor-pointer">
        <AvatarImage src={userImage} alt={userName} />
        <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-foreground/80">
            {userName}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>

        <div className="text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed">
          <MarkdownFormatter content={comment.content} contentWrapperRef={contentWrapperRef} isExpanded={isExpanded}/>
        </div>
        {isOverflowing && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 cursor-pointer select-none"
              aria-expanded={isExpanded}
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}

        {access && (
          <div className="flex items-center justify-end h-6">
            <div className={`transition-opacity duration-200 ${isPending ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50 px-2 py-2 cursor-pointer"
                onClick={handleDeleteComment}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Trash2 className="h-3 w-3 mr-1" />
                )}
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}