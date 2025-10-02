"use server"

import { createNewRepoDB } from "../db/repo"
import z from "zod"
import { newRepoSchema } from "../schemas/repo"
import { repoStatus, RepoTable } from "@/drizzle/schema"
import { db } from "@/drizzle/db"

export type GetReposParams = {
  userId?: string;
  search?: string;
  status?: repoStatus;
  page?: number;
  pageSize?: number;
}

export async function getRepos(params: GetReposParams) {
  const { userId, search, status, page = 1, pageSize = 10 } = params;

  let query = db.select().from(RepoTable);
  // add filters
  // let query = db.select().from(RepoTable);

  // // Filter by userId
  // if (userId) {
  //   query = query.where(RepoTable.userId.eq(userId));
  // }

  // // Filter by status
  // if (status) {
  //   query = query.where(RepoTable.status.eq(status));
  // }

  // // Filter by search (title)
  // if (search) {
  //   query = query.where(RepoTable.title.ilike(`%${search}%`));
  // }

  // // Pagination
  // query = query.limit(pageSize).offset((page - 1) * pageSize);

  // const repos = await query;
  // return repos;
  return query;
}

export async function createNewRepo(userId: string, repoData: z.infer<typeof newRepoSchema>) {
  try {
    const validated = newRepoSchema.parse(repoData);
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