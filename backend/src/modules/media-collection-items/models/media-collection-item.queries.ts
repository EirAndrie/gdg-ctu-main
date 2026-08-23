import { asc, count, eq, and } from "drizzle-orm";
import { db } from "../../../config/connectDB";
import { Pagination } from "../../../utils/pagination";
import { mediaCollectionItems } from "./media-collection-item";

export type MediaCollectionItemRecord =
      typeof mediaCollectionItems.$inferSelect;
export type NewMediaCollectionItemRecord =
      typeof mediaCollectionItems.$inferInsert;

export const insertMediaCollectionItem = async (
      data: NewMediaCollectionItemRecord,
) => {
      const [item] = await db
            .insert(mediaCollectionItems)
            .values(data)
            .returning();
      return item;
};

export const getMediaCollectionItems = async (pagination: Pagination) =>
      db
            .select()
            .from(mediaCollectionItems)
            .orderBy(asc(mediaCollectionItems.displayOrder))
            .limit(pagination.limit)
            .offset(pagination.offset);

export const countMediaCollectionItems = async () => {
      const [result] = await db
            .select({ total: count() })
            .from(mediaCollectionItems);
      return result.total;
};

export const getMediaCollectionItem = async (
      collectionId: string,
      mediaId: string,
) => {
      const [item] = await db
            .select()
            .from(mediaCollectionItems)
            .where(
                  and(
                        eq(mediaCollectionItems.collectionId, collectionId),
                        eq(mediaCollectionItems.mediaId, mediaId),
                  ),
            );
      return item;
};

export const deleteMediaCollectionItem = async (
      collectionId: string,
      mediaId: string,
) => {
      const [item] = await db
            .delete(mediaCollectionItems)
            .where(
                  and(
                        eq(mediaCollectionItems.collectionId, collectionId),
                        eq(mediaCollectionItems.mediaId, mediaId),
                  ),
            )
            .returning();
      return item;
};
