// src\features\user\actions\userAction.ts

"use server";

import { getUserByEmailDB } from "../db/userDb";


export async function getUserByEmail(email: string) {
  try {
    const user = await getUserByEmailDB(email);
    return user
  } catch (error) {
    console.error("Error getting user by email", error);
    return null;
  }
}