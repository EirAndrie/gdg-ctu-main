import { uuid, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { mediaCollections } from "../../media-collections/models/media-collection";
import { media } from "../../media/models/media";

export const mediaCollectionItems = pgTable("media_collection_items", {
      collectionId: uuid("collection_id").references(() => mediaCollections.id),
      mediaId: uuid("media_id").references(() => media.id),
      displayOrder: integer("display_order").default(1),
      caption: varchar("captions", { length: 255 }).default("Untitled Album"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
});
