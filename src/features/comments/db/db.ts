// src\features\comments\db\db.ts

import { db } from "@/drizzle/db";
import { commentTable, UsersTable } from "@/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";


export type NewCommentInput = typeof commentTable.$inferInsert;

export const createComment = async (data: NewCommentInput) => {
  try {
    const [newComment] = await db
      .insert(commentTable)
      .values(data)
      .returning();
      
    return { success: true, data: newComment };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { success: false, error: "Failed to create comment" };
  }
};


export const getCommentsByRepoId = async (repoId: string) => {
  try {
    const comments = await db
      .select({
        id: commentTable.id,
        content: commentTable.content,
        repoId: commentTable.repoId,
        createdAt: commentTable.createdAt,
        updatedAt: commentTable.updatedAt,
        userId: commentTable.userId,
        // Fetch user details for the UI
        user: {
          name: UsersTable.name,
          image: UsersTable.image,
          id: UsersTable.id,
        },
      })
      .from(commentTable)
      .leftJoin(UsersTable, eq(commentTable.userId, UsersTable.id))
      .where(eq(commentTable.repoId, repoId))
      .orderBy(desc(commentTable.createdAt)); // Most recent comments first

    return { success: true, data: comments };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { success: false, error: "Failed to fetch comments" };
  }
};


export const getCommentById = async (commentId: string) => {
  try {
    const [comment] = await db
      .select()
      .from(commentTable)
      .where(eq(commentTable.id, commentId));

    if (!comment) return { success: false, error: "Comment not found" };
    return { success: true, data: comment };
  } catch (error) {
    return { success: false, error: "Database error" };
  }
};


export const updateComment = async (
  commentId: string,
  userId: string,
  content: string
) => {
  try {
    const [updatedComment] = await db
      .update(commentTable)
      .set({ 
        content, 
        updatedAt: new Date() 
      })
      .where(
        and(
          eq(commentTable.id, commentId),
          eq(commentTable.userId, userId)
        )
      )
      .returning();

    if (!updatedComment) {
      return { success: false, error: "Comment not found or unauthorized" };
    }

    return { success: true, data: updatedComment };
  } catch (error) {
    console.error("Error updating comment:", error);
    return { success: false, error: "Failed to update comment" };
  }
};


export const deleteComment = async (commentId: string, userId: string) => {
  try {
    const [deletedComment] = await db
      .delete(commentTable)
      .where(
        and(
          eq(commentTable.id, commentId),
          eq(commentTable.userId, userId) // 🔒 Security check
        )
      )
      .returning();

    if (!deletedComment) {
      return { success: false, error: "Comment not found or unauthorized" };
    }

    return { success: true, data: deletedComment };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false, error: "Failed to delete comment" };
  }
};