import { db } from "@/drizzle/db";
import { collaboratorRoles, CollaboratorTable, ContentBlockTable } from "@/drizzle/schema";
import { and, asc, eq, inArray, isNull, sql } from "drizzle-orm";

const writeRoles: (typeof collaboratorRoles)[number][] = ["admin", "editor", "viewer"]; // i need to be careful

export async function getMaxOrder(repoId: string, parentId?: string | null) {
  try {
    const orderResult = await db
      .select({
        maxOrder: sql<number>`MAX(${ContentBlockTable.order})`.as("maxOrder"),
      })
      .from(ContentBlockTable)
      .where(
        and(
          eq(ContentBlockTable.repoId, repoId),
          // Handle null parentId correctly (for root-level blocks)
          parentId
            ? eq(ContentBlockTable.parentId, parentId)
            : isNull(ContentBlockTable.parentId)
        )
      );

    return orderResult[0];
  } catch (error) {
    console.error(error);
  }
}

export async function isPermited(userId: string, repoId: string) {
  try {
    const [collaborator] = await db
      .select({ role: CollaboratorTable.role })
      .from(CollaboratorTable)
      .where(
        and(
          eq(CollaboratorTable.repoId, repoId),
          eq(CollaboratorTable.userId, userId),
          inArray(CollaboratorTable.role, writeRoles),
        )
      );
    return collaborator;
  } catch (error) {
    console.error(error);
  }
}

export async function getBlocksDB(repoId: string, parentId?: string | null) {
  try {
    return await db
      .select()
      .from(ContentBlockTable)
      .where(
        and(
          eq(ContentBlockTable.repoId, repoId),
          // This logic correctly fetches root blocks OR nested blocks
          parentId
            ? eq(ContentBlockTable.parentId, parentId)
            : isNull(ContentBlockTable.parentId)
        )
      )
      .orderBy(asc(ContentBlockTable.order));
  } catch (error) {
    console.error(error);
  }
}