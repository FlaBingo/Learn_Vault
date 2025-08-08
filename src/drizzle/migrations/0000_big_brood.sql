CREATE TYPE "public"."repo_status" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('note', 'video', 'link', 'image', 'folder');--> statement-breakpoint
CREATE TYPE "public"."collaborator_roles" AS ENUM('owner', 'admin', 'editor');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"image" text,
	"isVerified" boolean DEFAULT false NOT NULL,
	"emailVerified" timestamp,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "repositories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "repo_status" DEFAULT 'private' NOT NULL,
	"user_id" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_block" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"repoId" uuid NOT NULL,
	"parentId" uuid,
	"type" "content_type" DEFAULT 'note' NOT NULL,
	"content" text NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"bgColor" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
	"role" "collaborator_roles" DEFAULT 'editor' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_repo_unique" UNIQUE("userId","repoId")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"repoId" uuid NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_block" ADD CONSTRAINT "content_block_repoId_repositories_id_fk" FOREIGN KEY ("repoId") REFERENCES "public"."repositories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_block" ADD CONSTRAINT "content_block_parent_fk" FOREIGN KEY ("parentId") REFERENCES "public"."content_block"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_block_tag" ADD CONSTRAINT "content_block_tag_contentBlockId_content_block_id_fk" FOREIGN KEY ("contentBlockId") REFERENCES "public"."content_block"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_block_tag" ADD CONSTRAINT "content_block_tag_tagId_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_repoId_repositories_id_fk" FOREIGN KEY ("repoId") REFERENCES "public"."repositories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_repoId_repositories_id_fk" FOREIGN KEY ("repoId") REFERENCES "public"."repositories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "repo_user_idx" ON "repositories" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "repo_status_idx" ON "repositories" USING btree ("status");--> statement-breakpoint
CREATE INDEX "content_repo_idx" ON "content_block" USING btree ("repoId");--> statement-breakpoint
CREATE INDEX "content_parent_idx" ON "content_block" USING btree ("parentId");--> statement-breakpoint
CREATE INDEX "content_type_idx" ON "content_block" USING btree ("type");--> statement-breakpoint
CREATE INDEX "content_order_idx" ON "content_block" USING btree ("order");--> statement-breakpoint
CREATE INDEX "idx_user" ON "collaborators" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_repo" ON "collaborators" USING btree ("repoId");--> statement-breakpoint
CREATE INDEX "idx_role" ON "collaborators" USING btree ("role");--> statement-breakpoint
CREATE INDEX "comment_user_idx" ON "comments" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "comment_repo_idx" ON "comments" USING btree ("repoId");