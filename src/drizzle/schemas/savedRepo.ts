// src/drizzle/schemas/savedRepos.ts
import { pgTable, timestamp, primaryKey, uuid } from "drizzle-orm/pg-core";
import { UsersTable } from "./user";
import { RepoTable } from "./repo";
import { relations } from "drizzle-orm";

export const savedRepos = pgTable("saved_repos", {
    userId: uuid("user_id")
      .notNull()
      .references(() => UsersTable.id, { onDelete: "cascade" }),
      
    repoId: uuid("repo_id")
      .notNull()
      .references(() => RepoTable.id, { onDelete: "cascade" }),
    savedAt: timestamp("saved_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.repoId] }),
  ]
);

export const savedReposRelations = relations(savedRepos, ({ one }) => ({
  user: one(UsersTable, {
    fields: [savedRepos.userId],
    references: [UsersTable.id],
  }),
  repo: one(RepoTable, {
    fields: [savedRepos.repoId],
    references: [RepoTable.id],
  }),
}));