// src\features\content-block\actions\content-block.ts
"use server";

import { ContentBlockTable } from "@/drizzle/schema";
import z from "zod";
import { ContentBlockSchema, GetBlocksSchema } from "../schemas/content-block";
import { auth } from "@/services/auth";
import { getAnyRepoByIdDB, getRepoByIdDB } from "@/features/repo/db/repo";
import { getBlocksDB, getMaxOrder, isPermited } from "../db/contentdb";
import { db } from "@/drizzle/db";
import { revalidatePath } from "next/cache";

// 1. defining types
export type ContentBlockInput = z.infer<typeof ContentBlockSchema>;
// type GetBlocksInput = z.infer<typeof GetBlocksSchema>;
type ActionResponse = {
  success: boolean;
  data?: typeof ContentBlockTable.$inferSelect;
  error?: string;
}

export async function createBlock(input: ContentBlockInput): Promise<ActionResponse> {
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
    revalidatePath(`/repo/${repoId}`);

    // 8. response 
    return { success: true, data: newBlock };

  } catch (error) {
    console.error("Failed to create block:", error);
    return { success: false, error: "An internal error occurred. Please try again." };
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

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized"
      }
    }

    const repo = await getAnyRepoByIdDB(repoId);
    if (!repo) {
      return { success: false, error: "Repository not found" };
    }
    let isAuthorized = false;
    if (repo.userId === userId) {
      isAuthorized = true;
    } else {
      const collaborator = await isPermited(userId, repoId);
      if (collaborator || repo.status === "public") {
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