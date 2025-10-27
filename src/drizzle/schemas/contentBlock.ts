// src/drizzle/schemas/contentBlock.ts
import { foreignKey, index, integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { RepoTable } from "./repo";
import { relations } from "drizzle-orm";
import { ContentBlockTagTable } from "./contentBlockTag";

export const contentType = ["note", "h1", "video", "link", "image", "folder", "pdf"] as const;
export type ContentType = (typeof contentType)[number];
export const contentTypeEnum = pgEnum("content_type", contentType)


export const ContentBlockTable = pgTable("content_block", {
  id,
  repoId: uuid().notNull().references(() => RepoTable.id, { onDelete: "cascade" }),
  parentId: uuid(),  // used lazy reference for self-referencing
  type: contentTypeEnum().notNull().default("note"),
  content: text().notNull(),
  description: text(),
  order: integer().notNull(),
  bgColor: text(),
  createdAt,
  updatedAt,
},
  (contentBlock) => [
    index("content_repo_idx").on(contentBlock.repoId),
    index("content_parent_idx").on(contentBlock.parentId),
    index("content_type_idx").on(contentBlock.type),
    index("content_order_idx").on(contentBlock.order),
    // Add foreign key constraint separately
    foreignKey({
      columns: [contentBlock.parentId],
      foreignColumns: [contentBlock.id],
      name: "content_block_parent_fk"
    }).onDelete("cascade")
  ]
)

export const contentBlockRelations = relations(ContentBlockTable, ({ one, many }) => ({
  repository: one(RepoTable, {
    fields: [ContentBlockTable.repoId],
    references: [RepoTable.id]
  }),
  parent: one(ContentBlockTable, {
    fields: [ContentBlockTable.parentId],
    references: [ContentBlockTable.id],
    relationName: "parent_child"
  }),
  children: many(ContentBlockTable, {
    relationName: "parent_child"
  }),
  contentBlockTags: many(ContentBlockTagTable)
}))

