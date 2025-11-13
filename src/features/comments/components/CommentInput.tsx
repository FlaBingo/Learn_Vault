// src/components/CommentInput.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Button } from "./ui/button";
// import { Textarea } from "./ui/textarea";
// import { postCommentAction } from "@/app/actions"; // You'll create this server action

export default function CommentInput({ repoId }: { repoId: string }) {
  const [comment, setComment] = useState("");

  // This would be your server action
  const handleSubmit = async (formData: FormData) => {
    // const result = await postCommentAction(formData);
    // if (result.success) {
    //   setComment(""); // Clear input on success
    //   // You'd also revalidate the path here
    // }
    
    // For now, just log it and clear
    console.log("Submitting comment:", comment, "for repo:", repoId);
    setComment("");
  };

  return (
    <form action={handleSubmit} className="flex gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Your Avatar" />
        <AvatarFallback>YOU</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <Textarea
          name="comment"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <input type="hidden" name="repoId" value={repoId} />
        <div className="flex justify-end">
          <Button type="submit" disabled={!comment.trim()}>
            Comment
          </Button>
        </div>
      </div>
    </form>
  );
}