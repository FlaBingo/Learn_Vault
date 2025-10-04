"use server"

import { createNewRepoDB } from "../db/repo"
import z from "zod"
import { newRepoSchema } from "../schemas/repo"
import { repoStatus, RepoTable } from "@/drizzle/schema"
import { db } from "@/drizzle/db"
import { and, eq } from "drizzle-orm"
import { auth } from "@/services/auth"

type SortBy = | "updated_desc" | "title_asc" | "title_desc";

export type GetReposParams = {
  search?: string;
  status?: repoStatus;
  sortBy?: SortBy;
  page?: number;
  pageSize?: number;
}

export async function getRepos(params: GetReposParams) {
  const userId = auth();
  
  const { search, status, sortBy, page = 1, pageSize = 10 } = params;
  
  let query = await db.select().from(RepoTable);
  if(!userId) {
    const result =  await db.query.RepoTable.findMany({
      where: eq(RepoTable.status, "public")
    })
  } else {

  }
  // add filters
  
}

export async function createNewRepo(userId: string, repoData: z.infer<typeof newRepoSchema>) {
  try {
    const validated = newRepoSchema.parse(repoData);
    const existingRepo = await db.query.RepoTable.findFirst({
      where: and(eq(RepoTable.userId, userId), eq(RepoTable.title, repoData.title))
    });
    if(existingRepo){
      return { success: false, message: "Repo with this title already exists"}
    }
    await createNewRepoDB({ ...validated, userId })
    return { success: true, message: "Repository created successfully" }
  } catch (error) {
    return { success: false, message: "Failed to create repository" }
  }
}






// Use parse when:
// You expect the data to be valid most of the time.
// Invalid data is an exceptional case that should halt the current operation.
// You are comfortable using try...catch blocks for error handling.
// You are in a context where throwing an error is the desired behavior (e.g., in a server-side framework's error handling middleware).

// Use safeParse when:
// You anticipate that the data might be invalid and want to handle it gracefully.
// You need to inspect the validation result to make decisions in your code (e.g., displaying different UI elements based on validity).
// You prefer to avoid try...catch blocks for control flow.