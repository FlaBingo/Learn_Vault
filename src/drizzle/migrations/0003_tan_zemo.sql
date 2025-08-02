ALTER TYPE "public"."course_section_status" RENAME TO "repo_status";--> statement-breakpoint
ALTER TABLE "content_block" ADD COLUMN "bgColor" text;--> statement-breakpoint
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_userId_repoId_unique" UNIQUE("userId","repoId");