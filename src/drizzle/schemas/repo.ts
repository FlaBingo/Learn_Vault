// src/drizzle/schemas/repo.ts
import { index, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UsersTable } from "./user";
import { relations } from "drizzle-orm";
import { ContentBlockTable } from "./contentBlock";
import { CollaboratorTable } from "./collaborator";
import { commentTable } from "./comments";

export const repoStatuses = ["public", "private"] as const
export type repoStatus = (typeof repoStatuses)[number]
export const repoStatusEnum = pgEnum("repo_status", repoStatuses);

export const RepoTable = pgTable("repositories", {
  id,
  title: text().notNull(),
  description: text(),
  status: repoStatusEnum().notNull().default("private"),
  userId: uuid("user_id").notNull().references(() => UsersTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
},
  (repo) => [
    index("repo_user_idx").on(repo.userId),
    index("repo_status_idx").on(repo.status),
  ]
)

export const repoRelations = relations(RepoTable, ({ one, many }) => ({
  user: one(UsersTable, {
    fields: [RepoTable.userId],
    references: [UsersTable.id]
  }),
  contentBlocks: many(ContentBlockTable),
  collaborators: many(CollaboratorTable),
  comments: many(commentTable),
}))