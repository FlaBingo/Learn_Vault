// src\features\content-block\schemas\content-block.ts
import { contentType } from "@/drizzle/schema";
import z from "zod";

export const ContentBlockSchema = z.object({
  repoId: z.uuid("Invalid repository ID"),
  parentId: z.uuid("Invalid parent ID").nullish(),
  type: z.enum(contentType),
  content: z.string().min(1, "Content is required."),
  description: z.string().min(1, "description is also required."),
  bgColor: z.string().max(20).nullish(),
})

export const GetBlocksSchema = z.object({
  repoId: z.uuid("Invalid repository ID"),
  parentId: z.uuid("Invalid parent ID").nullable().default(null),
});

export const ContentFormSchema = z.object({
  content: z.string().min(1, "Content is required"),
  description: z.string().min(1, "description is also required"),
})