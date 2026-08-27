import { relations } from "drizzle-orm";
import { terms } from "./terms";
import { memberTerms } from "../../member_terms/models/member-terms";

export const termsRelations = relations(terms, ({ many }) => ({
      memberTerms: many(memberTerms),
}));
