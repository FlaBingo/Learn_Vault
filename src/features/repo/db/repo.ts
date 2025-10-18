import { db } from "@/drizzle/db";
import { RepoTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getRepoByIdDB(repoId: string) {
  return db.query.RepoTable.findFirst({
    where: eq(RepoTable.id, repoId),
    columns: {
      userId: true,
      title: true,
    }
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

export async function deleteRepoDB(repoId: string) {
  try {
    const [deletedRepo] = await db.delete(RepoTable).where(eq(RepoTable.id, repoId)).returning();
    return deletedRepo;
  } catch (error) {
    console.log("Error in deleteRepoDB", error);
    throw new Error("Failed to delete repository");
  }
}