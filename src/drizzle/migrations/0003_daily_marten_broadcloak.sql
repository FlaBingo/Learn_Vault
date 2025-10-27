ALTER TYPE "public"."content_type" ADD VALUE 'h1' BEFORE 'video';--> statement-breakpoint
ALTER TYPE "public"."content_type" ADD VALUE 'pdf';--> statement-breakpoint
ALTER TABLE "collaborators" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "collaborators" ALTER COLUMN "role" SET DEFAULT 'editor'::text;--> statement-breakpoint
DROP TYPE "public"."collaborator_roles";--> statement-breakpoint
CREATE TYPE "public"."collaborator_roles" AS ENUM('editor');--> statement-breakpoint
ALTER TABLE "collaborators" ALTER COLUMN "role" SET DEFAULT 'editor'::"public"."collaborator_roles";--> statement-breakpoint
ALTER TABLE "collaborators" ALTER COLUMN "role" SET DATA TYPE "public"."collaborator_roles" USING "role"::"public"."collaborator_roles";