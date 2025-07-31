import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { ContentBlockTagTable } from "./contentBlockTag";


export const TagTable = pgTable("tags", {
  id,
  name: text().notNull().unique(),
  createdAt
})

export const tagRelations = relations(TagTable, ({many}) => ({
  contentBlockTags: many(ContentBlockTagTable)
}))