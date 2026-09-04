import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { memberTerms } from "./models/member-terms";

export const MemberTermsSchema = createSelectSchema(memberTerms);
export const CreateMemberTermsSchema = createInsertSchema(memberTerms)
      .omit({
            id: true,
            createdAt: true,
            updatedAt: true,
      })
      .extend({
            memberId: z.uuid({ message: "Member ID must be a valid UUID." }),
            termId: z.uuid({ message: "Term ID must be a valid UUID." }),
            role: z.string({ message: "Role is required." }),
            displayOrder: z.number().int().nonnegative().optional(),
            isActive: z.boolean().optional(),
      });

export const UpdateMemberTermSchema = CreateMemberTermsSchema.partial().refine(
      (data) => Object.keys(data).length > 0,
      "At least one field is required",
);

export type MemberTerms = z.infer<typeof MemberTermsSchema>;
export type CreateMemberTermsDTO = z.infer<typeof CreateMemberTermsSchema>;
export type UpdateMemberTermDTO = z.infer<typeof UpdateMemberTermSchema>;
