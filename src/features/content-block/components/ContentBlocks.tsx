// src\features\content-block\components\ContentBlocks.tsx

import { Loader2 } from "lucide-react";
import { getBlocks } from "../actions/content-block";
import ContentBlock from "./ContentBlock";

interface Props {
  params: { repoId: string; parentId?: string; slug?: string[] };
  // open: boolean;
  // onOpenChange: (open: boolean) => void;
}

export default async function ContentBlocks({ params }: Props) {
  const { repoId, parentId, slug } = await params;
  // console.log(repoId, parentId)
  const content_blocks = await getBlocks({ repoId, parentId });
  const { data } = content_blocks;
  return (
    <>
      <div>
        {data?.map((block, index) => (
          <div key={block.id} className="grid resize-y">
            <ContentBlock input={block} slug={slug} />
          </div>
        ))}
      </div>
    </>
  );
}
