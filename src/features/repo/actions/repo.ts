// src/features/repo/actions/repo.ts
"use server"

import { createNewRepoDB, deleteRepoDB, getAnyRepoByIdDB, getRepoByIdDB, getUserByRepoIdDB, updateRepoDB } from "../db/repo"
import z from "zod"
import { newRepoSchema } from "../schemas/repo"
import { repoStatus, RepoTable } from "@/drizzle/schema"
import { db } from "@/drizzle/db"
import { and, asc, count, desc, eq, ilike, ne, or } from "drizzle-orm"
import { auth } from "@/services/auth"
import { modeType, sortBy } from "@/lib/types/sorttypes"
import { revalidatePath } from "next/cache"
import { isPermited } from "@/features/content-block/db/contentdb"

export type GetReposParams = {
  search?: string;
  status?: repoStatus;
  sortBy?: sortBy;
  page?: number;
  pageSize?: number;
  mode?: modeType;
}

export async function getRepositories(params: GetReposParams) {
  try {
    const { search, status, sortBy, page = 1, pageSize = 10, mode } = params;
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId && mode !== "explore") {
      return {
        success: true,
        data: [],
        pagination: { currentPage: 1, pageSize: 10, totalPages: 0, totalCount: 0 }
      }
    }
    const conditions = [];

    if (userId) {
      if (mode === "explore" || mode === "all") {
        conditions.push(ne(RepoTable.userId, userId));
      } else {
        conditions.push(eq(RepoTable.userId, userId));
      }
    }


    if (status) {
      conditions.push(eq(RepoTable.status, status));
    } else if (mode === "explore") {
      conditions.push(eq(RepoTable.status, "public"));
    }

    if (search && search !== "") {
      const searchTerm = `%${search}%`;
      const searchCondition = or(
        ilike(RepoTable.title, searchTerm),
        ilike(RepoTable.description, searchTerm)
      )
      if (searchCondition) {
        conditions.push(searchCondition);
        // console.log(searchCondition)
      }
    }

    const whereClause = and(...conditions);

    let orderByClause = desc(RepoTable.updatedAt);
    switch (sortBy) {
      case "title_asc": orderByClause = asc(RepoTable.title); break;
      case "title_desc": orderByClause = desc(RepoTable.title); break;
    }

    const [repos, totalResult] = await Promise.all([
      db.select().from(RepoTable).where(whereClause).orderBy(orderByClause).limit(pageSize).offset((page - 1) * pageSize),
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

export async function getRepoById(repoId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      // const repo = await getAnyRepoByIdDB(repoId);
      return { success: false, error: "Unauthorized: You must be logged in." };
    }
    const repo = await getRepoByIdDB(userId, repoId);
    return { success: true, data: repo }
  } catch (error) {
    console.log("Error getting repo by id")
    return { success: false, error }
  }
}

export async function getAnyRepoById(repoId: string) {
  try {
    const repo = await getAnyRepoByIdDB(repoId);
    return { success: true, data: repo };
  } catch (error) {
    return { success: false, error};
  }
}

export async function createNewRepo(repoData: z.infer<typeof newRepoSchema>) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { success: false, message: "Unauthorized: You must be logged in." };
    }
    const validated = newRepoSchema.parse(repoData);
    const existingRepo = await db.query.RepoTable.findFirst({
      where: and(eq(RepoTable.userId, userId), eq(RepoTable.title, repoData.title))
    });
    if (existingRepo) {
      return { success: false, message: `${validated.title} already exists` }
    }
    await createNewRepoDB({ ...validated, userId })
    return { success: true, message: "Repository created successfully" }
  } catch (error) {
    console.error("Error creating repo: ", error)
    return { success: false, message: "Failed to create repository" }
  }
}

export async function updateRepo(repoId: string, repoData: z.infer<typeof newRepoSchema>) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { success: false, error: "Unauthorized: You must be logged in." };
    }
    const repo = await getRepoByIdDB(userId, repoId);
    if (!repo) {
      const collaborator = await isPermited(userId, repoId);
      if(!collaborator || collaborator.role !== "admin"){
        return { success: false, error: "Repository does not exist or access denied." };
      }
    }
    await updateRepoDB(repoId, { ...repoData, userId });
    revalidatePath("/my-repos");
    return { success: true, message: "Repo udpated successfully" }
  } catch (error) {
    console.log("Error updating repo: ", error)
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteRepo(repoId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { success: false, error: "Unauthorized: You must be logged in." };
    }
    const repo = await getRepoByIdDB(userId, repoId);
    if (!repo) {
      const collaborator = await isPermited(userId, repoId);
      if(!collaborator || collaborator.role !== "admin"){
        return { success: false, error: "Repository does not exist or access denied." };
      }
    }
    await deleteRepoDB(repoId);
    revalidatePath("/my-repos");
    return { success: true, message: `Repository deleted successfully.` };
  } catch (error) {
    console.error("Error deleting repository", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getUserByRepoId(repoId: string) {
  try {
    return await getUserByRepoIdDB(repoId);
  } catch (error) {
    console.error("Error getting user by repo id")
    return null;
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