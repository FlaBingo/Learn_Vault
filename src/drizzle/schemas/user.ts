// src/drizzle/schemas/user.ts

import { boolean, index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { RepoTable } from "./repo";
import { CollaboratorTable } from "./collaborator";
import { commentTable } from "./comments";
import { savedRepos } from "./savedRepo";


export const UsersTable = pgTable("users", {
  id,
  name: text().notNull(),
  email: text().notNull().unique(),
  image: text(),
  description: text(),
  location: text(),
  website: text(),
  isVerified: boolean().notNull().default(false),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  createdAt,
  updatedAt,
},
  (table) => [
    uniqueIndex("user_email_idx").on(table.email),
  ]
)

export const usersRelations = relations(UsersTable, ({ many }) => ({
  repositories: many(RepoTable),
  collaborations: many(CollaboratorTable),
  comments: many(commentTable),
  savedRepos: many(savedRepos),
}))