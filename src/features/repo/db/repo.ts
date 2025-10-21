import { db } from "@/drizzle/db";
import { RepoTable, UsersTable } from "@/drizzle/schema";
import { and, eq, ne } from "drizzle-orm";

export async function getRepoByIdDB(userId: string, repoId: string) {
  try {
    return await db.query.RepoTable.findFirst({
      where: and(eq(RepoTable.id, repoId), eq(RepoTable.userId, userId)),
    });
  } catch (error) {
    console.error("Error in getRepoByIdDB", error);
    return null
  }
}

export async function getAnyRepoByIdDB(repoId: string) {
  try {
    return await db.query.RepoTable.findFirst({
      where: eq(RepoTable.id, repoId),
    });
  } catch (error) {
    console.error("Error in getRepoByIdDB", error);
    return null
  }
}

export async function getUserByRepoIdDB(repoId: string) {
  try {
    const repo = await db.query.RepoTable.findFirst({
      where: eq(RepoTable.id, repoId),
      columns: {
        userId: true,
      }
    });
    if (!repo) return null;
    const user = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, repo.userId)
    });
    return user ?? null;
  } catch (error) {
    console.error("Error in getUserByRepoIdDB", error);
    return null;
  }
}

export async function createNewRepoDB(repoData: typeof RepoTable.$inferInsert) {
  try {
    const [newRepo] = await db.insert(RepoTable).values(repoData).returning();
    return newRepo;
  } catch (error) {
    console.log("Error in createNewRepoDB", error);
    throw new Error("Failed to create repository");
  }
}

export async function updateRepoDB(repoId: string, repoData: typeof RepoTable.$inferInsert) {
  try {
    const updatedRepo = await db.update(RepoTable).set({ ...repoData, updatedAt: new Date() }).where(eq(RepoTable.id, repoId)).returning();
    return updatedRepo[0];
  } catch (error) {
    console.log("Error in createNewRepoDB", error);
    throw new Error("Failed to update repository");
  }
}

export async function deleteRepoDB(repoId: string) {
  try {
    const [deletedRepo] = await db.delete(RepoTable).where(eq(RepoTable.id, repoId)).returning();
    return deletedRepo;
  } catch (error) {
    console.log("Error in deleteRepoDB", error);
    throw new Error("Failed to delete repository");
  }
}