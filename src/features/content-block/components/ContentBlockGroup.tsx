// src/features/content-block/components/ContentBlockGroup.tsx

import ContentBlockEditor from "./content-block-editor";


export default async function ContentBlockGroup() {
  return (
    <div className="min-h-[500px] border-3 dark:border-gray-500 rounded-xl p-3">
      <ContentBlockEditor />
    </div>
  );
}