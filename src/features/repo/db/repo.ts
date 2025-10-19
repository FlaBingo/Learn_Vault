import { db } from "@/drizzle/db";
import { RepoTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function getRepoByIdDB(userId: string, repoId: string) {
  return db.query.RepoTable.findFirst({
    where: and(eq(RepoTable.id, repoId), eq(RepoTable.userId, userId)),
  });
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
    const updatedRepo = await db.update(RepoTable).set({...repoData, updatedAt: new Date()}).where(eq(RepoTable.id, repoId)).returning();
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