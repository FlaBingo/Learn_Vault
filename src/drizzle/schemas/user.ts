// src/drizzle/schemas/user.ts

import { boolean, index, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { RepoTable } from "./repo";
import { CollaboratorTable } from "./collaborator";
import { commentTable } from "./comments";


export const UsersTable = pgTable("users", {
  id,
  name: text().notNull(),
  email: text().notNull().unique(),
  image: text(),
  isVerified: boolean().notNull().default(false),
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
}))