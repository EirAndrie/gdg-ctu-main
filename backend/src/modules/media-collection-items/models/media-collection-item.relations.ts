import { relations } from "drizzle-orm";
import { mediaCollections } from "../../media-collections/models/media-collection";
import { media } from "../../media/models/media";
import { mediaCollectionItems } from "./media-collection-item";

export const mediaCollectionItemsRelations = relations(
      mediaCollectionItems,
      ({ one }) => ({
            collection: one(mediaCollections, {
                  fields: [mediaCollectionItems.collectionId],
                  references: [mediaCollections.id],
            }),
            media: one(media, {
                  fields: [mediaCollectionItems.mediaId],
                  references: [media.id],
            }),
      }),
);
