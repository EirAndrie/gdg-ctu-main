ALTER TABLE "media" RENAME COLUMN "storage_key" TO "public_id";--> statement-breakpoint
ALTER TABLE "media" RENAME COLUMN "filename" TO "original_filename";--> statement-breakpoint
ALTER TABLE "media" DROP CONSTRAINT "media_storage_key_unique";--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "cloudinary_asset_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "secure_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "resource_type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "format" varchar(50);--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "width" integer;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "height" integer;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "bytes" integer;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "media" DROP COLUMN "url";--> statement-breakpoint
ALTER TABLE "media" DROP COLUMN "mime_type";--> statement-breakpoint
ALTER TABLE "media" DROP COLUMN "file_size";--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_cloudinary_asset_id_unique" UNIQUE("cloudinary_asset_id");--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_public_id_unique" UNIQUE("public_id");