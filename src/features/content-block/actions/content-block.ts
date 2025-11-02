// src\features\content-block\actions\content-block.ts
"use server";

import { ContentBlockTable } from "@/drizzle/schema";
import z from "zod";
import { ContentBlockSchema, GetBlocksSchema } from "../schemas/content-block";
import { auth } from "@/services/auth";
import { getAnyRepoByIdDB, getRepoByIdDB } from "@/features/repo/db/repo";
import { deleteBlockDB, getBlocksDB, getMaxOrder, isPermited, updateBlockDB } from "../db/contentdb";
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

    const blocks = await getBlocksDB(repoId, parentId);
    return { success: true, data: blocks };

  } catch (error) {
    console.error("Failed to get blocks:", error);
    return { success: false, error: "An internal error occurred. Please try again." };
  }
}

export async function updateBlock(pathname: string, input: ContentBlockInput & { id: string; order: number }) {
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

    const repo = await getRepoById(repoId);
    if (!repo) {
      const collaborator = await isPermited(userId, repoId);
      if (!collaborator || collaborator.role === "viewer") {
        return {
          success: false,
          error: "Repository not found or access denied",
        }
      }
    }

    const updatedBlock = await updateBlockDB(input.id, input);

    // revalidating the path by using usePathname
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

    const repo = await getRepoById(repoId);
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
    return { success: true, data: deletedContent };
  } catch (error) {
    console.error("Failed to delete block:", error);
    return { success: false, error: "An internal error occurred. Please try again." + `${error}` };
  }
}