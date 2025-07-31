// src/drizzle/schemas/user.ts

import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { RepoTable } from "./repo";


export const UsersTable = pgTable("users", {
  id,
  name: text().notNull(),
  email: text().notNull().unique(),
  image: text(),
  isVerified: boolean().notNull().default(false),
  createdAt,
  updatedAt,
})

export const usersRelations = relations(UsersTable, ({ many }) => ({
  repositories: many(RepoTable),
}))