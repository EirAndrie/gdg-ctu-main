import { relations } from "drizzle-orm";
import { media } from "../../media/models/media";
import { admins } from "../../admins/models/admin";
import { mediaCollections } from "./media-collection";

export const mediaCollectionsRelations = relations(
      mediaCollections,
      ({ one, many }) => ({
            coverMedia: one(media, {
                  fields: [mediaCollections.coverMediaId],
                  references: [media.id],
            }),
            createdByAdmin: one(admins, {
                  fields: [mediaCollections.createdBy],
                  references: [admins.id],
            }),
            // items relation omitted to avoid circular dependency
      }),
);
