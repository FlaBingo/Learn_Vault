import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UsersTable } from "./user";
import { RepoTable } from "./repo";
import { relations } from "drizzle-orm";


export const commentTable = pgTable("comments", {
  id,
  userId: uuid().notNull().references(() => UsersTable.id, { onDelete: "cascade"}),
  repoId: uuid().notNull().references(() => RepoTable.id, { onDelete: "cascade"}),
  content: text().notNull(),
  createdAt,
  updatedAt,
},
  (table) => [
    index("comment_user_idx").on(table.userId),
    index("comment_repo_idx").on(table.repoId)
  ]
)

export const commentRelations = relations(commentTable, ({one}) => ({
  user: one(UsersTable, {
    fields: [commentTable.userId],
    references: [UsersTable.id],
  }),
  repository: one(RepoTable, {
    fields: [commentTable.repoId],
    references: [RepoTable.id],
  })
}))