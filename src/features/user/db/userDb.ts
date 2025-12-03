// src\features\user\db\userDb.ts

import { db } from "@/drizzle/db";
// Make sure to import these schemas from where you export them (e.g., your central schema file or specific files)
import { UsersTable, RepoTable, CollaboratorTable, savedRepos } from "@/drizzle/schema"; 
import { eq, desc } from "drizzle-orm";

export async function getUserByEmailDB(email: string) {
  try {
    const user = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, email))
      .limit(1);

    return user[0] || null;
  } catch (error) {
    console.error("Error in getUserByEmailDB:", error);
    return null;
  }
}

/**
 * Fetches all repositories a specific user is collaborating on.
 * Returns the Repository details and the User's role in that repo.
 */
export async function getMyCollabReposByUserIdDB(userId: string) {
  try {
    const results = await db
      .select({
        repo: RepoTable,
        role: CollaboratorTable.role,
        joinedAt: CollaboratorTable.createdAt,
      })
      .from(CollaboratorTable)
      .innerJoin(RepoTable, eq(CollaboratorTable.repoId, RepoTable.id))
      .where(eq(CollaboratorTable.userId, userId))
      .orderBy(desc(CollaboratorTable.createdAt)); // Optional: Order by newest joined

    return results;
  } catch (error) {
    console.error("Error in getMyCollabReposByUserIdDB:", error);
    return [];
  }
}

/**
 * Fetches all collaborators for a specific repository.
 * Returns the User details and their Role.
 */
export async function getCollaboratersByRepoIdDB(repoId: string) {
  try {
    const results = await db
      .select({
        user: UsersTable,
        role: CollaboratorTable.role,
        joinedAt: CollaboratorTable.createdAt,
      })
      .from(CollaboratorTable)
      .innerJoin(UsersTable, eq(CollaboratorTable.userId, UsersTable.id))
      .where(eq(CollaboratorTable.repoId, repoId));

    return results;
  } catch (error) {
    console.error("Error in getCollaboratersByRepoIdDB:", error);
    return [];
  }
}

/**
 * Fetches all repositories saved by a specific user.
 * Returns the Repository details and when it was saved.
 */
export async function getSavedReposByUserIdDB(userId: string) {
  try {
    const results = await db
      .select({
        repo: RepoTable,
        savedAt: savedRepos.savedAt,
      })
      .from(savedRepos)
      .innerJoin(RepoTable, eq(savedRepos.repoId, RepoTable.id))
      .where(eq(savedRepos.userId, userId))
      .orderBy(desc(savedRepos.savedAt)); // Optional: Order by newest saved

    return results;
  } catch (error) {
    console.error("Error in getSavedReposByUserIdDB:", error);
    return [];
  }
}