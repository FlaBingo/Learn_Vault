// src/lib/types/sorttypes.ts
export const sortByOptions = ["updated_desc" , "title_asc" , "title_desc" ] as const;
export type sortBy = (typeof sortByOptions)[number];
