import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { siteContent } from "./models/site-content";

export const SiteContentSchema = createSelectSchema(siteContent);

export const CreateSiteContentSchema = createInsertSchema(siteContent)
      .omit({
            id: true,
            updatedAt: true,
      })
      .extend({
            sectionKey: z
                  .string()
                  .trim()
                  .min(1, { message: "Section key is required." }),
            title: z.string().trim().min(1, { message: "Title is required." }),
            subtitle: z.string().nullable().optional(),
            body: z.string().nullable().optional(),
            mediaId: z
                  .uuid()
                  .nullable()
                  .optional()
                  .refine((val) => !val || val.length > 0, {
                        message: "Media ID must be a valid UUID if provided.",
                  }),
            buttonText: z.string().trim().nullable().optional(),
            buttonUrl: z
                  .url()
                  .nullable()
                  .optional()
                  .refine((val) => !val || val.length > 0, {
                        message: "Button URL must be a valid URL if provided.",
                  }),
            isActive: z.boolean().optional(),
            updatedBy: z
                  .string({ error: "UpdatedBy is required" })
                  .trim()
                  .min(1, {
                        message: "UpdatedBy must be a non‑empty string (Clerk ID).",
                  }),
      });

export const UpdateSiteContentSchema = CreateSiteContentSchema.partial()
      .extend({
            updatedBy: z
                  .string({ error: "UpdatedBy is required" })
                  .trim()
                  .min(1, {
                        message: "UpdatedBy must be a non‑empty string (Clerk ID).",
                  }),
      })
      .refine(
            (data) => Object.keys(data).length > 1,
            "At least one content field is required",
      );

export type SiteContent = z.infer<typeof SiteContentSchema>;
export type CreateSiteContentDTO = z.infer<typeof CreateSiteContentSchema>;
export type UpdateSiteContentDTO = z.infer<typeof UpdateSiteContentSchema>;
