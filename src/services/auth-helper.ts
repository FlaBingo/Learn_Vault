import { auth } from "./auth";


export async function getAuthenticatedUser() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  return { session, userId };
}