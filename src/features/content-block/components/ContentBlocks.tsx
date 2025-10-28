// src\features\content-block\components\ContentBlocks.tsx

import { Separator } from "@/components/ui/separator";
import { getBlocks } from "../actions/content-block";
import ContentBlock from "./ContentBlock";

interface Props {
  params: {repoId: string};
}

export default async function ContentBlocks({params}: Props) {
  const {repoId} = await params;
  const content_blocks = await getBlocks({repoId});
  const {data} = content_blocks;
  return (
    <>
      <div>
        {data?.map((block) => (
          <div key={block.id} className="grid">
            <ContentBlock input={block}/>
            <Separator />
          </div>
        ))}
      </div>
    </>
  );
}