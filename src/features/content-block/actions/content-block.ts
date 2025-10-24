// src\features\content-block\actions\content-block.ts
"use server";

import { ContentBlockTable } from "@/drizzle/schema";
import z from "zod";


export async function createBlock(repoId: string, contentData: typeof ContentBlockTable) {
  
}