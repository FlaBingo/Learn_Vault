"use server";

import { revalidatePath } from "next/cache";
import { 
  createCommentDB, 
  deleteCommentDB, 
  getCommentsByRepoIdDB, 
  updateCommentDB 
} from "../db/db";
import { auth } from "@/services/auth";


export async function getCommentsByRepoId(repoId: string, repoStatus?: string | undefined) {
  const comments = await getCommentsByRepoIdDB(repoId);
  return comments;
}


export async function createCommentAction(repoId: string, content: string, pathname: string) {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) {
    return { success: false, error: "You must be logged in to comment." };
  }

  if (!content.trim()) {
    return { success: false, error: "Comment content cannot be empty." };
  }

  const result = await createCommentDB({
    content,
    repoId,
    userId: user.id,
  });

  if (result.success) {
    revalidatePath(pathname);
  }

  return result;
}


export async function updateCommentAction(commentId: string, repoId: string, content: string, pathname: string) {
  const session = await auth();
  const user = session?.user;
  
  if (!user || !user.id) {
    return { success: false, error: "Unauthorized" };
  }

  if (!content.trim()) {
    return { success: false, error: "Content cannot be empty" };
  }

  const result = await updateCommentDB(commentId, user.id, content);

  if (result.success) {
    revalidatePath(pathname);
  }

  return result;
}


export async function deleteCommentAction(commentId: string, repoId: string, pathname: string) {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return { success: false, error: "Unauthorized" };
  }

  const result = await deleteCommentDB(commentId, user.id);

  if (result.success) {
    revalidatePath(pathname);
  }

  return result;
}

