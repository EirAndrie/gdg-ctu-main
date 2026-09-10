ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "events_created_by_admins_id_fk";--> statement-breakpoint
ALTER TABLE "media_collections" DROP CONSTRAINT IF EXISTS "media_collections_created_by_admins_id_fk";--> statement-breakpoint
ALTER TABLE "media" DROP CONSTRAINT IF EXISTS "media_uploaded_by_admins_id_fk";--> statement-breakpoint
ALTER TABLE "site_content" DROP CONSTRAINT IF EXISTS "site_content_updated_by_admins_id_fk";--> statement-breakpoint
ALTER TABLE "admins" DROP CONSTRAINT IF EXISTS "admins_clerk_id_unique";--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "id" SET DATA TYPE varchar(255) USING "id"::varchar;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "created_by" SET DATA TYPE varchar USING "created_by"::varchar;--> statement-breakpoint
ALTER TABLE "media_collections" ALTER COLUMN "created_by" SET DATA TYPE varchar USING "created_by"::varchar;--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "uploaded_by" SET DATA TYPE varchar USING "uploaded_by"::varchar;--> statement-breakpoint
ALTER TABLE "site_content" ALTER COLUMN "updated_by" SET DATA TYPE varchar USING "updated_by"::varchar;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_collections" ADD CONSTRAINT "media_collections_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_admins_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_content" ADD CONSTRAINT "site_content_updated_by_admins_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admins" DROP COLUMN IF EXISTS "clerk_id";--> statement-breakpoint
ALTER TABLE "admins" DROP COLUMN IF EXISTS "password_hash";--> statement-breakpoint
ALTER TABLE "admins" DROP COLUMN IF EXISTS "first_name";--> statement-breakpoint
ALTER TABLE "admins" DROP COLUMN IF EXISTS "last_name";--> statement-breakpoint
ALTER TABLE "admins" DROP COLUMN IF EXISTS "profile_img_url";
