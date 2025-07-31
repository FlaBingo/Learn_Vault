// src/drizzle/schemas/contentBlock.ts
import { index, integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { RepoTable } from "./repo";
import { relations } from "drizzle-orm";
import { ContentBlockTagTable } from "./contentBlockTag";

export const contentType = ["note", "video", "link", "image", "folder"] as const;
export type ContentType = (typeof contentType)[number] // never understood this line 
export const contentTypeEnum = pgEnum("content_type", contentType)


export const ContentBlockTable = pgTable("content_block", {
  id,
  repoId: uuid().notNull().references(() => RepoTable.id, { onDelete: "cascade" }),
  type: contentTypeEnum().notNull().default("note"),
  content: text().notNull(),
  description: text(),
  order: integer().notNull(),
  createdAt,
  updatedAt,
},
  (contentBlock) => ({
    repoIdx: index("repo_idx").on(contentBlock.repoId),
    typeIdx: index("type_idx").on(contentBlock.type),
    orderIdx: index("order_idx").on(contentBlock.order)
  })
)

export const contentBlockRelations = relations(ContentBlockTable, ({ one, many }) => ({
  repository: one(RepoTable, {
    fields: [ContentBlockTable.repoId],
    references: [RepoTable.id]
  }),
  contentBlockTags: many(ContentBlockTagTable)
}))

