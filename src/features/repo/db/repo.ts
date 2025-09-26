import { db } from "@/drizzle/db";
import { RepoTable } from "@/drizzle/schema";

export async function createNewRepoDB(repoData: typeof RepoTable.$inferInsert) {
  try {
    const [newRepo] = await db.insert(RepoTable).values(repoData).returning();
    return newRepo;
  } catch (error) {
    throw new Error("Failed to create repository");
  }
}