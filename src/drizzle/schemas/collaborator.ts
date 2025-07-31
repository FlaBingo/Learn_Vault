import { pgEnum, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UsersTable } from "./user";
import { RepoTable } from "./repo";
import { relations } from "drizzle-orm";

export const collaboratorRoles = ["owner", "editor", "viewer"] as const;
export type collaboratorRole = (typeof collaboratorRoles)[number];
export const collaboratorRolesEnum = pgEnum("collaborator_roles", collaboratorRoles);

export const CollaboratorTable = pgTable("collaborators", {
  id,
  userId: uuid().notNull().references(() => UsersTable.id, { onDelete: "cascade"}),
  repoId: uuid().notNull().references(() => RepoTable.id, { onDelete: "cascade"}),
  role: collaboratorRolesEnum().notNull().default("viewer"),
  createdAt,
  updatedAt,
}, 
  (table) => ({
    uniqueUserRepo: unique().on(table.userId, table.repoId), // not completely sure about the syntax
  })
)

export const collaboratorRelations = relations(CollaboratorTable, ({one}) => ({
  user: one(UsersTable, {
    fields: [CollaboratorTable.userId],
    references: [UsersTable.id],
  }),
  repository: one(RepoTable, {
    fields: [CollaboratorTable.id],
    references: [RepoTable.id],
  })
}))