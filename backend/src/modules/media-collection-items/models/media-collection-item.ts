import {
      integer,
      timestamp,
      uuid,
      varchar,
      primaryKey,
} from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { mediaCollections } from "../../media-collections/models/media-collection";
import { media } from "../../media/models/media";

export const mediaCollectionItems = pgTable(
      "media_collection_items",
      {
            collectionId: uuid("collection_id")
                  .notNull()
                  .references(() => mediaCollections.id),
            mediaId: uuid("media_id")
                  .notNull()
                  .references(() => media.id),
            displayOrder: integer("display_order").default(0).notNull(),
            caption: varchar("caption", { length: 255 }),
            addedAt: timestamp("added_at").defaultNow().notNull(),
      },
      (table) => {
            return {
                  pk: primaryKey(table.collectionId, table.mediaId),
            };
      },
);
