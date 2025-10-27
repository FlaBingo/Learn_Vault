// src\features\content-block\schemas\content-block.ts
import { contentType } from "@/drizzle/schema";
import z from "zod";

export const ContentBlockSchema = z.object({
  repoId: z.uuid("Invalid repository ID"),
  parentId: z.uuid("Invalid parent ID").nullable(),
  type: z.enum(contentType),
  content: z.string().min(1, "Content is required."), // You can add .min(1) if content can't be empty
  description: z.string().min(1, "description is also required."),
  bgColor: z.string().max(20).nullish(), // Max length for safety
})

export const GetBlocksSchema = z.object({
  repoId: z.uuid("Invalid repository ID"),
  parentId: z.uuid("Invalid parent ID").nullable().default(null),
});
