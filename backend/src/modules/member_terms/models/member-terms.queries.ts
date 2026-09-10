import { asc, count, eq } from "drizzle-orm";
import { db } from "../../../config/connectDB";
import { Pagination } from "../../../utils/pagination";
import { memberTerms } from "./member-terms";
import { terms } from "../../terms/models/terms";
import { teamMembers } from "../../team-members/models/team-member";

export type MemberTermsRecord = typeof memberTerms.$inferSelect;
export type NewMemberTermsRecord = typeof memberTerms.$inferInsert;

export const createMemberTerm = async (data: NewMemberTermsRecord) => {
      const [memberTerm] = await db
            .insert(memberTerms)
            .values(data)
            .returning();
      return memberTerm;
};

export const countMemberTerms = async () => {
      const [result] = await db.select({ total: count() }).from(memberTerms);
      return result.total;
};

export const getMemberTerms = async (pagination: Pagination) =>
      db
            .select()
            .from(memberTerms)
            .orderBy(asc(memberTerms.displayOrder))
            .limit(pagination.limit)
            .offset(pagination.offset);

export const getTeamMembersByTermId = async (
      termId: string,
      pagination: Pagination,
) => {
      const members = db
            .select({
                  // Associative Table Fields
                  memberTermId: memberTerms.id,
                  role: memberTerms.role,
                  displayOrder: memberTerms.displayOrder,
                  isActive: memberTerms.isActive,
                  // Fields from team member Table
                  memberId: teamMembers.id,
                  firstName: teamMembers.firstName,
                  lastName: teamMembers.lastName,
                  slug: teamMembers.slug,
                  profileMediaId: teamMembers.profileMediaId,
                  // Fields from the term table
                  termId: terms.id,
                  termName: terms.name,
                  termStartDate: terms.startDate,
                  termEndDate: terms.endDate,
            })
            .from(memberTerms)
            .where(eq(memberTerms.termId, termId))
            .innerJoin(teamMembers, eq(memberTerms.memberId, teamMembers.id))
            .innerJoin(terms, eq(memberTerms.termId, terms.id))
            .orderBy(asc(memberTerms.displayOrder), asc(teamMembers.lastName))
            .limit(pagination.limit)
            .offset(pagination.offset);

      return members;
};

export const getMemberTermById = async (id: string) => {
      const [memberTerm] = await db
            .select()
            .from(memberTerms)
            .where(eq(memberTerms.id, id));
      return memberTerm;
};

export const updateMemberTerm = async (
      id: string,
      data: Partial<NewMemberTermsRecord>,
) => {
      const [memberTerm] = await db
            .update(memberTerms)
            .set(data)
            .where(eq(memberTerms.id, id))
            .returning();
      return memberTerm;
};

export const deleteMemberTerm = async (id: string) => {
      const [memberTerm] = await db
            .delete(memberTerms)
            .where(eq(memberTerms.id, id))
            .returning();
      return memberTerm;
};
