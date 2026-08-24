import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { mediaCollections } from "./models/media-collection";

export const MediaCollectionRecordSchema = createSelectSchema(mediaCollections);

export const MediaCollectionSchema = MediaCollectionRecordSchema.omit({});

export const CreateMediaCollectionSchema = createInsertSchema(mediaCollections)
      .omit({ id: true, createdAt: true, updatedAt: true })
      .extend({
            name: z.string().min(1),
            slug: z.string().min(1),
            description: z.string().optional(),
            coverMediaId: z.string().uuid().optional().nullable(),
            createdBy: z.string().uuid(),
      });

export const UpdateMediaCollectionSchema =
      CreateMediaCollectionSchema.partial().refine(
            (data) => Object.keys(data).length > 0,
            "At least one field is required",
      );

export type MediaCollectionRecord = z.infer<typeof MediaCollectionRecordSchema>;
export type MediaCollection = z.infer<typeof MediaCollectionSchema>;
export type CreateMediaCollectionDTO = z.infer<
      typeof CreateMediaCollectionSchema
>;
export type UpdateMediaCollectionDTO = z.infer<
      typeof UpdateMediaCollectionSchema
>;
