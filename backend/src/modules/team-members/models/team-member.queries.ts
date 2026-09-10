import { and, asc, count, eq } from "drizzle-orm";
import { db } from "../../../config/connectDB";
import { Pagination } from "../../../utils/pagination";
import { eventSpeakers } from "../../event-speakers/models/event-speaker";
import { teamMembers } from "./team-member";

export type TeamMemberRecord = typeof teamMembers.$inferSelect;
export type NewTeamMemberRecord = typeof teamMembers.$inferInsert;

export const insertTeamMember = async (
      data: NewTeamMemberRecord,
      profilePictureId: string,
) => {
      const [teamMember] = await db
            .insert(teamMembers)
            .values({
                  ...data,
                  ...(profilePictureId
                        ? { profileMediaId: profilePictureId }
                        : {}),
            })
            .returning();
      return teamMember;
};

export const getTeamMembers = async (pagination: Pagination) =>
      db
            .select()
            .from(teamMembers)
            .orderBy(asc(teamMembers.displayOrder), asc(teamMembers.lastName))
            .limit(pagination.limit)
            .offset(pagination.offset);

export const countTeamMembers = async () => {
      const [result] = await db.select({ total: count() }).from(teamMembers);
      return result.total;
};

export const getTeamMemberById = async (id: string) => {
      const [teamMember] = await db
            .select()
            .from(teamMembers)
            .where(eq(teamMembers.id, id));
      return teamMember;
};

export const getTeamMemberBySlug = async (slug: string) => {
      const [teamMember] = await db
            .select()
            .from(teamMembers)
            .where(eq(teamMembers.slug, slug));
      return teamMember;
};

/** Public feed: active members only (safe fields projected by the controller). */
export const getActiveTeamMembers = async (featuredOnly = false) => {
      const where = featuredOnly
            ? and(
                        eq(teamMembers.isActive, true),
                        eq(teamMembers.isFeatured, true),
                  )
            : eq(teamMembers.isActive, true);
      return db
            .select()
            .from(teamMembers)
            .where(where)
            .orderBy(asc(teamMembers.displayOrder), asc(teamMembers.lastName));
};

export const getActiveTeamMemberBySlug = async (slug: string) => {
      const [teamMember] = await db
            .select()
            .from(teamMembers)
            .where(
                  and(
                        eq(teamMembers.slug, slug),
                        eq(teamMembers.isActive, true),
                  ),
            );
      return teamMember;
};

export const updateTeamMember = async (
      id: string,
      data: Partial<NewTeamMemberRecord>,
) => {
      const [teamMember] = await db
            .update(teamMembers)
            .set(data)
            .where(eq(teamMembers.id, id))
            .returning();
      return teamMember;
};

export const deleteTeamMember = async (id: string) => {
      const [teamMember] = await db
            .delete(teamMembers)
            .where(eq(teamMembers.id, id))
            .returning();
      return teamMember;
};

export const teamMemberHasEventSpeakerReferences = async (id: string) => {
      const [speaker] = await db
            .select({ id: eventSpeakers.id })
            .from(eventSpeakers)
            .where(eq(eventSpeakers.teamMemberId, id))
            .limit(1);

      return Boolean(speaker);
};
