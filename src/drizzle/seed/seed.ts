import 'dotenv/config';
import { db } from "../db";
import { CollaboratorTable, ContentBlockTable, RepoTable } from "../schema";
import { v4 as uuidv4 } from "uuid";

// types based on the schemas
type NewRepo = typeof RepoTable.$inferInsert;
type NewContentBlock = typeof ContentBlockTable.$inferInsert;

const userId = "550e8400-e29b-41d4-a716-446655440000";

async function seedDatabase() {
  try {
    // repositories
    const repos: NewRepo[] = [
      {
        id: uuidv4(),
        userId: userId,
        title: "Learn Javascript",
        description: "Curated Javascript",
        status: "private",
      },
      {
        id: uuidv4(),
        userId: userId,
        title: "TypeScript Basics",
        description: "TypeScript fundamentals",
        status: "public",
      },
      {
        id: uuidv4(),
        userId: userId,
        title: "React Mastery",
        description: "Advanced React patterns and practices",
        status: "public",
      },
    ];

    const insertedRepos = await db.query.RepoTable.findMany();
    // Add collaborator entries for the user as owner
    const collaborators = insertedRepos.map(repo => ({
      id: uuidv4(),
      userId: userId,
      repoId: repo.id,
      role: "owner" as const,
    }));

    // await db.insert(CollaboratorTable).values(collaborators);

    const contentBlocks: NewContentBlock[] = [
      {
        id: uuidv4(),
        repoId: repos[0].id as string, // Explicitly converts to string type
        type: "note",
        content: "Javascript is a single-threaded scripting language",
        order: 1,
        bgColor: "#f0f0f0"
      },
      {
        id: uuidv4(),
        repoId: repos[0].id!, // Just says "trust me, this won't be null"
        type: "video",
        content: "https://youtube.com/example",
        description: "JS Arrays Tutorial",
        order: 2,
        bgColor: "#e0e0e0"
      },
      {
        id: uuidv4(),
        repoId: repos[2].id!,
        type: "link",
        content: "https://react.dev",
        description: "React Documentation",
        order: 1,
        bgColor: "#d0d0d0"
      }
    ];
    // await db.insert(ContentBlockTable).values(contentBlocks);
    console.log("seed data inserted successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}
// seedDatabase();