"use server"

import { createNewRepoDB } from "../db/repo"
import z from "zod"
import { newRepoSchema } from "../schemas/repo"

export async function createNewRepo(userId: string, repoData: z.infer<typeof newRepoSchema>) {
  await createNewRepoDB({...repoData, userId})
  return { success: true, message: "Repository created Successfully" }
}