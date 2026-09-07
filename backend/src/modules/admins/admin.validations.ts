import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { admins } from "./models/admin";

export const AdminRecordSchema = createSelectSchema(admins);

export const AdminSchema = AdminRecordSchema.omit({});

export const CreateAdminSchema = createInsertSchema(admins)
      .omit({
            createdAt: true,
            updatedAt: true,
      })
      .extend({
            id: z
                  .string()
                  .trim()
                  .min(1, { message: "Clerk ID must be a non‑empty string." }),
            email: z
                  .email({ error: "Please provide a valid email address." })
                  .trim()
                  .toLowerCase(),
            isActive: z.boolean().optional(),
      });

export const UpdateAdminSchema = CreateAdminSchema.partial().refine(
      (data) => Object.keys(data).length > 0,
      "At least one field is required",
);

export type AdminRecord = z.infer<typeof AdminRecordSchema>;
export type Admin = z.infer<typeof AdminSchema>;
export type CreateAdminDTO = z.infer<typeof CreateAdminSchema>;
export type UpdateAdminDTO = z.infer<typeof UpdateAdminSchema>;
