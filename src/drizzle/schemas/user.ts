// src/drizzle/schemas/user.ts

import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";


export const UsersTable = pgTable("users", {
  id,
  name: text().notNull(),
  email: text().notNull().unique(),
  isVerified: boolean().notNull().default(false),
  createdAt,
  updatedAt,
})

export const usersRelations = relations(UsersTable, ({ many }) => ({
  
}))