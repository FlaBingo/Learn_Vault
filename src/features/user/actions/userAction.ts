// src\features\user\actions\userAction.ts

"use server";

import { 
  getUserByEmailDB, 
  getMyCollabReposByUserIdDB, 
  getCollaboratersByRepoIdDB, 
  getSavedReposByUserIdDB 
} from "../db/userDb";

export async function getUserByEmail(email: string) {
  try {
    const user = await getUserByEmailDB(email);
    return user;
  } catch (error) {
    console.error("Error getting user by email", error);
    return null;
  }
}

/**
 * Get repositories that a specific user (userId) is collaborating on.
 * Useful for profile pages.
 */
export async function getUserCollabRepos(userId: string) {
  try {
    const repos = await getMyCollabReposByUserIdDB(userId);
    return repos;
  } catch (error) {
    console.error("Error getting user collab repos", error);
    return []; 
  }
}

/**
 * Get the list of collaborators for a specific repository.
 */
export async function getRepoCollaborators(repoId: string) {
  try {
    const collaborators = await getCollaboratersByRepoIdDB(repoId);
    return collaborators;
  } catch (error) {
    console.error("Error getting repo collaborators", error);
    return [];
  }
}

/**
 * Get repositories that a specific user has saved/bookmarked.
 */
export async function getUserSavedRepos(userId: string) {
  try {
    const saved = await getSavedReposByUserIdDB(userId);
    return saved;
  } catch (error) {
    console.error("Error getting user saved repos", error);
    return [];
  }
}