// src\features\content-block\components\ContentBlocks.tsx

import { Loader2 } from "lucide-react";
import { getBlocks, userRepoRole } from "../actions/content-block";
import ContentBlock from "./ContentBlock";
import { collaboratorRole } from "@/drizzle/schema";
import { getRepoById } from "@/features/repo/actions/repo";
import { auth } from "@/services/auth";

interface Props {
  params: { repoId: string; parentId?: string; slug?: string[] };
}

export default async function ContentBlocks({ params }: Props) {
  const { repoId, parentId, slug } = params;
  const content_blocks = await getBlocks({ repoId, parentId });
  const { data } = content_blocks;

  const session = await auth();
  const userId = session?.user?.id;
  let role: collaboratorRole | undefined;
  if (userId) {
    role = (await userRepoRole(userId, repoId)).data?.role;
  }
  const repo = await getRepoById(repoId);
  const owner: boolean = !!userId && repo.data?.userId === userId;
  
  
  return (
    <>
      <div className="lg:grid lg:grid-cols-2 lg:gap-3">
        {data?.map((block, index) => (
          <div key={block.id} className={`${(block.type === "h1" || block.type === "qna" || block.type === "collage") && "lg:col-span-full"}`}>
            <ContentBlock input={block} slug={slug} owner={owner} role={role} userId={userId} />
          </div>
        ))}
      </div>
    </>
  );
}
