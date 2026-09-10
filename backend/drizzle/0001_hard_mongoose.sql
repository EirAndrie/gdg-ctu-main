ALTER TABLE "admins" DROP CONSTRAINT "admins_clerk_id_unique";--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "created_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "media_collections" ALTER COLUMN "created_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "uploaded_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "site_content" ALTER COLUMN "updated_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "admins" DROP COLUMN "clerk_id";--> statement-breakpoint
ALTER TABLE "admins" DROP COLUMN "password_hash";--> statement-breakpoint
ALTER TABLE "admins" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "admins" DROP COLUMN "last_name";--> statement-breakpoint
ALTER TABLE "admins" DROP COLUMN "profile_img_url";