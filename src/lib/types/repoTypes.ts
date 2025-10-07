
export const repoStatuses = ["public", "private"] as const
export type repoStatus = (typeof repoStatuses)[number];