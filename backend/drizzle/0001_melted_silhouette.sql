CREATE TABLE "media_collection_items" (
	"collection_id" uuid,
	"media_id" uuid,
	"display_order" integer DEFAULT 1,
	"captions" varchar(255) DEFAULT 'Untitled Album',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"cover_media_id" uuid,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_collections_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "media_collection_items" ADD CONSTRAINT "media_collection_items_collection_id_media_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."media_collections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_collection_items" ADD CONSTRAINT "media_collection_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_collections" ADD CONSTRAINT "media_collections_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_collections" ADD CONSTRAINT "media_collections_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;