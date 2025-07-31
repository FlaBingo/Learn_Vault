CREATE TYPE "public"."content_type" AS ENUM('note', 'video', 'link', 'image', 'folder');--> statement-breakpoint
CREATE TABLE "content_block" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"repoId" uuid NOT NULL,
	"type" "content_type" DEFAULT 'note' NOT NULL,
	"content" text NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_block" ADD CONSTRAINT "content_block_repoId_repositories_id_fk" FOREIGN KEY ("repoId") REFERENCES "public"."repositories"("id") ON DELETE cascade ON UPDATE no action;