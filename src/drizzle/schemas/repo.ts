import { index, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UsersTable } from "./user";
import { relations } from "drizzle-orm";

export const repoStatuses = ["public", "private"] as const
export type repoStatus = (typeof repoStatuses)[number]
export const repoStatusEnum = pgEnum("course_section_status", repoStatuses);

export const repoTable = pgTable("repositories", {
  id,
  title: text().notNull(),
  description: text(),
  status: repoStatusEnum().notNull().default("private"),
  userId: uuid("user_id").notNull().references(() => UsersTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
},
  (repo) => ({
    userIdx: index("user_idx").on(repo.userId),
    statusIdx: index("status_idx").on(repo.status),
  })
)

export const repoRelations = relations(repoTable, ({one}) => ({
  user: one(UsersTable, {
    fields: [repoTable.userId],
    references: [UsersTable.id]
  })
}))