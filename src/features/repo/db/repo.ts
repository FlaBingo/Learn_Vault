import { db } from "@/drizzle/db";
import { RepoTable } from "@/drizzle/schema";

export async function createNewRepoDB(repoData: typeof RepoTable.$inferInsert) {
  const newRepo = db.insert(RepoTable).values(repoData).returning();
  console.log(newRepo)
}