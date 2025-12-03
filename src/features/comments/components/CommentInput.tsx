// src/components/CommentInput.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";
import { createCommentAction } from "../actions/comments";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function CommentInput({
  repoId,
  imageUrl,
}: {
  repoId: string;
  imageUrl: string | null | undefined;
}) {
  const pathname = usePathname();
  console.log(pathname);
  const [isPending, startTransition] = useTransition();
  const [comment, setComment] = useState("");

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const repoId = formData.get("repoId")?.toString();
        const comment = formData.get("comment")?.toString();
        if (!repoId || !comment) {
          console.error("Missing repoId or comment content.");
          return;
        }
        const result = await createCommentAction(repoId, comment, pathname);
        if (result.success) {
          setComment("");
          toast.success("Comment added successfully.");
        } else {
          toast.error("Something went wrong...");
        }
        console.log("Submitting comment:", comment, "for repo:", repoId);
        setComment("");
      } catch (error) {
        console.error("Internal Server Error..." + error);
      }
    });
  };

  const MAX_LENGTH = 300;
  const remainingChars = MAX_LENGTH && MAX_LENGTH - (comment.length || 0);

  return (
    <form action={handleSubmit} className="flex gap-4">
      <Avatar>
        <AvatarImage src={imageUrl ? imageUrl : ""} alt="Your Avatar" />
        <AvatarFallback>YOU</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <Textarea
          name="comment"
          placeholder="Write a comment (Markdown enabled)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          maxLength={MAX_LENGTH}
        />
        <input type="hidden" name="repoId" value={repoId} />
        <span className="text-red-400 font-bold">{remainingChars}</span>{" "}
        characters remaining
        <br />
        Up to {MAX_LENGTH} characters.
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!comment.trim() || isPending}
            className="cursor-pointer"
          >
            {!isPending ? "Comment" : <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </div>
    </form>
  );
}
