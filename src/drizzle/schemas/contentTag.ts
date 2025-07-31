import { pgTable, uuid } from "drizzle-orm/pg-core";
import { ContentBlockTable } from "./contentBlock";
import { TagTable } from "./tags";
import { relations } from "drizzle-orm";


export const ContentBlockTagTable = pgTable("content_block_tag", {
  contentBlockId: uuid().notNull().references(() => ContentBlockTable.id, { onDelete: "cascade"}),
  tagId: uuid().notNull().references(() => TagTable.id, {onDelete: "cascade"}),
})

export const contentBlockTagRelations = relations(ContentBlockTagTable, ({ one }) => ({
  contentBlock: one(ContentBlockTable, {
    fields: [ContentBlockTagTable.contentBlockId],
    references: [ContentBlockTable.id],
  }),
  tag: one(TagTable, {
    fields: [ContentBlockTagTable.tagId],
    references: [TagTable.id]
  })
}))


// use cases:

// const blocksWithTags = await db.query.ContentBlockTable.findMany({
//   with: {
//     contentBlockTags: {
//       with: {
//         tag: true
//       }
//     }
//   }
// });

// [
//   {
//     id: ...,
//     content: ...,
//     contentBlockTags: [
//       { tag: { name: "javascript" } },
//       { tag: { name: "frontend" } }
//     ]
//   },
//   ...
// ]
