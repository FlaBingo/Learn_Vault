import { db } from "@/drizzle/db";
import { UsersTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getUserByEmailDB(email: string) {
try {
    const user = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, email))
      .limit(1);

    return user[0] || null; // return the first match or null
  } catch (error) {
    console.error("Error in getUserByEmailDB:", error);
    return null;
  }
}