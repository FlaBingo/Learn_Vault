// src\components\CommentSection.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommentInput from "./CommentInput";
import { Separator } from "@/components/ui/separator";
import CommentList from "./CommentList";
import { getCommentsByRepoId } from "../actions/comments";
import { auth } from "@/services/auth";

export default async function CommentSection({ repoId }: { repoId: string }) {
  const session = await auth();
  const logedInUser = session?.user;

  const data = await getCommentsByRepoId(repoId);
  const comments = data?.data;
  
  
  return (
    <Card className="overflow-auto">
      <CardHeader>
        <CardTitle>Comments ({comments && comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {logedInUser && <CommentInput repoId={repoId} imageUrl={logedInUser.image}/>}
        <Separator />
        <CommentList comments={comments}/>
      </CardContent>
    </Card>
  );
}
