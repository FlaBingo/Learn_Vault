CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"repoId" uuid NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "email_idx";--> statement-breakpoint
DROP INDEX "user_idx";--> statement-breakpoint
DROP INDEX "status_idx";--> statement-breakpoint
DROP INDEX "repo_idx";--> statement-breakpoint
DROP INDEX "parent_idx";--> statement-breakpoint
DROP INDEX "type_idx";--> statement-breakpoint
DROP INDEX "order_idx";--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_repoId_repositories_id_fk" FOREIGN KEY ("repoId") REFERENCES "public"."repositories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comment_user_idx" ON "comments" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "comment_repo_idx" ON "comments" USING btree ("repoId");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "repo_user_idx" ON "repositories" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "repo_status_idx" ON "repositories" USING btree ("status");--> statement-breakpoint
CREATE INDEX "content_repo_idx" ON "content_block" USING btree ("repoId");--> statement-breakpoint
CREATE INDEX "content_parent_idx" ON "content_block" USING btree ("parentId");--> statement-breakpoint
CREATE INDEX "content_type_idx" ON "content_block" USING btree ("type");--> statement-breakpoint
CREATE INDEX "content_order_idx" ON "content_block" USING btree ("order");