CREATE TYPE "public"."collaborator_roles" AS ENUM('owner', 'editor', 'viewer');--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "content_block_tag" (
	"contentBlockId" uuid NOT NULL,
	"tagId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collaborators" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"repoId" uuid NOT NULL,
	"role" "collaborator_roles" DEFAULT 'viewer' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_block_tag" ADD CONSTRAINT "content_block_tag_contentBlockId_content_block_id_fk" FOREIGN KEY ("contentBlockId") REFERENCES "public"."content_block"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_block_tag" ADD CONSTRAINT "content_block_tag_tagId_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_repoId_repositories_id_fk" FOREIGN KEY ("repoId") REFERENCES "public"."repositories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "repo_idx" ON "content_block" USING btree ("repoId");--> statement-breakpoint
CREATE INDEX "type_idx" ON "content_block" USING btree ("type");--> statement-breakpoint
CREATE INDEX "order_idx" ON "content_block" USING btree ("order");