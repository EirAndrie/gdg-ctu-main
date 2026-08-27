import { relations } from "drizzle-orm";
import { memberTerms } from "./member-terms";
import { teamMembers } from "../../team-members/models/team-member";
import { terms } from "../../terms/models/terms";

export const memberTermsRelations = relations(memberTerms, ({ one }) => ({
      member: one(teamMembers, {
            fields: [memberTerms.memberId],
            references: [teamMembers.id],
      }),

      term: one(terms, {
            fields: [memberTerms.termId],
            references: [terms.id],
      }),
}));
