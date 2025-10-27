// src\features\content-block\components\ContentBlock.tsx

import { ContentBlockTable } from "@/drizzle/schema";


type ContentBlockProps = {
  input: typeof ContentBlockTable.$inferSelect
}


export default async function ContentBlock({input}: ContentBlockProps) {
  return (
    <>
      <div>{input.content}</div>
      <div>{input.description}</div>
      <div>{input.parentId}</div>
      <div>{input.type}</div>
    </>
  );
}
