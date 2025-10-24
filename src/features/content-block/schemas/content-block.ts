// src\features\content-block\schemas\content-block.ts
import z from "zod";

export const newContentSchema = z.object({
  content: z.string().min(1, "content is required"),
  description: z.string().min(1, "description is also required"),
  bgColor: z.string(),
})

