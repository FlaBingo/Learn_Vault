ALTER TABLE "collaborators" DROP CONSTRAINT "collaborators_userId_repoId_unique";--> statement-breakpoint
ALTER TABLE "collaborators" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "collaborators" ALTER COLUMN "role" SET DEFAULT 'editor'::text;--> statement-breakpoint
DROP TYPE "public"."collaborator_roles";--> statement-breakpoint
CREATE TYPE "public"."collaborator_roles" AS ENUM('owner', 'admin', 'editor');--> statement-breakpoint
ALTER TABLE "collaborators" ALTER COLUMN "role" SET DEFAULT 'editor'::"public"."collaborator_roles";--> statement-breakpoint
ALTER TABLE "collaborators" ALTER COLUMN "role" SET DATA TYPE "public"."collaborator_roles" USING "role"::"public"."collaborator_roles";--> statement-breakpoint
ALTER TABLE "content_block" ADD COLUMN "parentId" uuid;--> statement-breakpoint
ALTER TABLE "content_block" ADD CONSTRAINT "content_block_parent_fk" FOREIGN KEY ("parentId") REFERENCES "public"."content_block"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "parent_idx" ON "content_block" USING btree ("parentId");--> statement-breakpoint
CREATE INDEX "idx_user" ON "collaborators" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_repo" ON "collaborators" USING btree ("repoId");--> statement-breakpoint
CREATE INDEX "idx_role" ON "collaborators" USING btree ("role");--> statement-breakpoint
ALTER TABLE "collaborators" ADD CONSTRAINT "user_repo_unique" UNIQUE("userId","repoId");