// src\features\content-block\components\ContentBlocks.tsx

import { Loader2 } from "lucide-react";
import { getBlocks } from "../actions/content-block";
import ContentBlock from "./ContentBlock";

interface Props {
  params: { repoId: string; parentId?: string; slug?: string[] };
}

export default async function ContentBlocks({ params }: Props) {
  const { repoId, parentId, slug } = await params;
  const content_blocks = await getBlocks({ repoId, parentId });
  const { data } = content_blocks;
  return (
    <>
      <div className="lg:grid lg:grid-cols-2 lg:gap-3">
        {data?.map((block, index) => (
          <div key={block.id} className={`${(block.type === "h1" || block.type === "qna" || block.type === "collage") && "lg:col-span-full"}`}>
            <ContentBlock input={block} slug={slug} />
          </div>
        ))}
      </div>
    </>
  );
}
