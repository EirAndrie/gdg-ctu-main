import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { mediaCollectionItems } from "./models/media-collection-item";

export const MediaCollectionItemRecordSchema = createSelectSchema(mediaCollectionItems);

export const MediaCollectionItemSchema = MediaCollectionItemRecordSchema.omit({});

export const CreateMediaCollectionItemSchema = createInsertSchema(mediaCollectionItems)
      .omit({ addedAt: true })
      .extend({
            collectionId: z.string().uuid(),
            mediaId: z.string().uuid(),
            displayOrder: z.number().int().optional(),
            caption: z.string().optional(),
      });

export const UpdateMediaCollectionItemSchema = CreateMediaCollectionItemSchema.partial().refine(
      data => Object.keys(data).length > 0,
      "At least one field is required",
);

export type MediaCollectionItemRecord = z.infer<typeof MediaCollectionItemRecordSchema>;
export type MediaCollectionItem = z.infer<typeof MediaCollectionItemSchema>;
export type CreateMediaCollectionItemDTO = z.infer<typeof CreateMediaCollectionItemSchema>;
export type UpdateMediaCollectionItemDTO = z.infer<typeof UpdateMediaCollectionItemSchema>;
