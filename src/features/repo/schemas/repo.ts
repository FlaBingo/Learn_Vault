import { repoStatuses } from "@/drizzle/schema";
import z from "zod";

export const newRepoSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string(),
  status: z.enum(repoStatuses),
})

