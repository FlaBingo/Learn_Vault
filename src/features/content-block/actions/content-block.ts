// src\features\content-block\actions\content-block.ts
"use server";

import { collaboratorRole, ContentBlockTable } from "@/drizzle/schema";
import z, { success } from "zod";
import { ContentBlockSchema, GetBlocksSchema } from "../schemas/content-block";
import { auth } from "@/services/auth";
import { getAnyRepoByIdDB, getRepoByIdDB } from "@/features/repo/db/repo";
import { deleteBlockDB, getBlocksDB, getContentByIdDB, getFolderByIdDB, getMaxOrder, isPermited, updateBlockDB } from "../db/contentdb";
import { db } from "@/drizzle/db";
import { revalidatePath } from "next/cache";
import { getRepoById } from "@/features/repo/actions/repo";

// 1. defining types
export type ContentBlockInput = z.infer<typeof ContentBlockSchema>;
// type GetBlocksInput = z.infer<typeof GetBlocksSchema>;
type ActionResponse = {
  success: boolean;
  data?: typeof ContentBlockTable.$inferSelect;
  error?: string;
}

export async function createBlock(pathname: string, input: ContentBlockInput): Promise<ActionResponse> {
  // 2. validate the input;
  const validatedInput = ContentBlockSchema.safeParse(input);
  if (!validatedInput.success) {
    return {
      success: false,
      error: validatedInput.error.message || "Invalid input"
    }
  }
  const { repoId, parentId, ...blockData } = validatedInput.data;

  try {
    // 3. authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized"
      }
    }
    const userId = session.user.id;

    // 4. authorization
    const repo = await getRepoByIdDB(userId, repoId);
    if (!repo) {
      const collaborator = await isPermited(userId, repoId);
      if (!collaborator || collaborator?.role === "viewer") {
        return {
          success: false,
          error: "Repository not found or access denied",
        }
      }
    }

    // 5. Business logic: calculate the new 'order'
    const orderResult = await getMaxOrder(repoId, parentId);

    const newOrder = (orderResult?.maxOrder ?? 0) + 1;


    // 6. Data operation
    const [newBlock] = await db.insert(ContentBlockTable).values({
      ...blockData,
      repoId,
      parentId,
      order: newOrder,
    }).returning();

    // 7. cache revalidation
    revalidatePath(pathname);

    // 8. response 
    return { success: true, data: newBlock };

  } catch (error) {
    console.error("Failed to create block:", error);
    return { success: false, error: "An internal error occurred. Please try again." + `${error}` };
  }
}

export async function getBlocks(input: {
  repoId: string,
  parentId?: string,
}) {
  const validatedInput = GetBlocksSchema.safeParse(input);

  if (!validatedInput.success) {
    return {
      success: false,
      error: validatedInput.error.message || "Invalid Input",
    };
  }

  const { repoId, parentId } = validatedInput.data;

  try {
    const session = await auth();
    const userId = session?.user?.id;


    const repo = await getAnyRepoByIdDB(repoId);
    if (!session?.user?.id && repo?.status === "private") {
      return {
        success: false,
        error: "Unauthorized"
      }
    }

    if (!repo) {
      return { success: false, error: "Repository not found" };
    }
    let isAuthorized = false;
    if (repo.userId === userId || repo.status === "public") {
      isAuthorized = true;
    } else if (userId) {
      const collaborator = await isPermited(userId, repoId);
      if (collaborator) {
        isAuthorized = true;
      }
    }
    if (!isAuthorized) {
      return { success: false, error: "Access denied" };
    }
    // console.log(repoId, parentId);
    const blocks = await getBlocksDB(repoId, parentId);
    return { success: true, data: blocks };

  } catch (error) {
    console.error("Failed to get blocks:", error);
    return { success: false, error: "An internal error occurred. Please try again." };
  }
}

export async function getContentById(contentId: string, repoId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  try {
    const repo = await getAnyRepoByIdDB(repoId);
    let role: collaboratorRole | undefined;
    if(userId){
      role = await isPermited(userId, repoId).then((result) => result?.role);
    }
    if(((userId === repo?.userId) && repo?.userId) || repo?.status === "public" || role){
      const data = await getContentByIdDB(contentId, repoId);
      if(!data){
        return { success: false, error: "Not found"}
      }
      return { success: true, data}
    }
    return { success: false, error: "Access Denied"}
  } catch (error) {
    console.log("Error getting content by id:", error)
    return { success: false, error: "Content not found."}
  }
}

export async function getFolderById(folderId: string) {
  try {
    const folders = await getFolderByIdDB(folderId);
    if(!folders){
      return {
        success: false,
        error: "Not Found"
      }
    }
    return { success: true, data: folders[0] };
  } catch (error) {
    console.error("Error getting folders by id", error);
    return { success: false, error: "An internal error occurred. Please try again." + `${error}`}
  }
}

export async function updateBlock(pathname: string, input: typeof ContentBlockTable.$inferInsert) {
  const validatedInput = ContentBlockSchema.safeParse(input);
  if (!validatedInput.success) {
    return {
      success: false,
      error: validatedInput.error.message || "Invalid input"
    }
  }
  const { repoId } = validatedInput.data;

  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized"
      }
    }

    const repo = await getAnyRepoByIdDB(repoId);
    if (!repo) {
      const collaborator = await isPermited(userId, repoId);
      if (!collaborator || collaborator.role === "viewer") {
        return {
          success: false,
          error: "Repository not found or access denied",
        }
      }
    }

    if(!input.id){
      return {
        success: false,
        error: "Content Block doesn't exit"
      }
    }

    

    const updatedBlock = await updateBlockDB(input.id, input);
    revalidatePath(pathname);
    return {
      success: true,
      data: updatedBlock,
    }

  } catch (error) {
    console.error("Failed to update block:", error);
    return { success: false, error: "An internal error occurred. Please try again." + `${error}` };
  }
}

export async function deleteBlock(pathname: string, contentId: string, repoId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized"
      }
    }

    const repo = await getAnyRepoByIdDB(repoId);
    if (!repo) {
      const collaborator = await isPermited(userId, repoId);
      if (!collaborator || collaborator.role === "viewer") {
        return {
          success: false,
          error: "Repository not found or access denied",
        }
      }
    }

    const deletedContent = await deleteBlockDB(contentId);

    revalidatePath(pathname);
    return { success: true, data: deletedContent };
  } catch (error) {
    console.error("Failed to delete block:", error);
    return { success: false, error: "An internal error occurred. Please try again." + `${error}` };
  }
}

export async function userRepoRole(userId: string, repoId: string) {
  try {
    const role = await isPermited(userId, repoId);
    if(!role){
      return {
        success: false,
        error: "access denied."
      }
    }
    return { success: true, data: role};
  } catch (error) {
    console.error("Failed to get user role w.r.t. repo:", error);
    return { success: false, error: "An internal error occurred. Please try again." + `${error}` };
  }
}