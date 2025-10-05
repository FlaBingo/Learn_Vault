"use server"

import { createNewRepoDB } from "../db/repo"
import z, { success } from "zod"
import { newRepoSchema } from "../schemas/repo"
import { repoStatus, RepoTable } from "@/drizzle/schema"
import { db } from "@/drizzle/db"
import { and, asc, count, desc, eq, ilike, isNotNull, or, SQL } from "drizzle-orm"
import { auth } from "@/services/auth"

type SortBy = | "updated_desc" | "title_asc" | "title_desc";

export type GetReposParams = {
  search?: string;
  status?: repoStatus;
  sortBy?: SortBy;
  page?: number;
  pageSize?: number;
}

export async function getMyRepos(params: GetReposParams) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return {
        status: true,
        data: [],
        pagination: { currentPage: 1, pageSize: 10, totalPages: 0, totalCount: 0 }
      }
    }
    const { search, status, sortBy, page = 1, pageSize = 10 } = params;
    const conditions = [
      eq(RepoTable.userId, userId),
    ];
    if (status) {
      conditions.push(eq(RepoTable.status, status));
    }
    if (search) {
      const searchTerm = `%${search}%`;
      const searchCondition = or(
        ilike(RepoTable.title, searchTerm),
        ilike(RepoTable.description, searchTerm)
      )
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const whereClause = and(...conditions);

    let orderByClause = desc(RepoTable.updatedAt);
    switch (sortBy) {
      case "title_asc": orderByClause = asc(RepoTable.title); break;
      case "title_desc": orderByClause = desc(RepoTable.title); break;
    }

    const [repos, totalResult] = await Promise.all([
      db.select().from(RepoTable).where(whereClause).orderBy(orderByClause).limit(pageSize).offset((page - 1) * pageSize), // don't know about limit and offset methods
      db.select({ total: count() }).from(RepoTable).where(whereClause),
    ])
    const totalCount = totalResult[0].total;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      success: true,
      data: repos,
      pagination: { currentPage: page, pageSize, totalPages, totalCount },
    };

  } catch (error) {
    console.error("Failed to get my repos", error);
    return {
      success: false,
      error: "An unexpected error occurred.",
      data: [],
      pagination: { currentPage: 1, pageSize: 10, totalPages: 0, totalCount: 0 }
    }
  }
}

export async function createNewRepo(userId: string, repoData: z.infer<typeof newRepoSchema>) {
  try {
    const validated = newRepoSchema.parse(repoData);
    const existingRepo = await db.query.RepoTable.findFirst({
      where: and(eq(RepoTable.userId, userId), eq(RepoTable.title, repoData.title))
    });
    if (existingRepo) {
      return { success: false, message: "Repo with this title already exists" }
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