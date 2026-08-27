import { AppError } from "../../utils/http";
import { getPaginationMeta, Pagination } from "../../utils/pagination";
import { getMediaById } from "../media/models/media.queries";
import {
      countTeamMembers,
      deleteTeamMember,
      getTeamMemberById,
      getTeamMemberBySlug,
      getTeamMembers,
      insertTeamMember,
      teamMemberHasEventSpeakerReferences,
      updateTeamMember,
} from "./models/team-member.queries";
import {
      CreateTeamMemberDTO,
      UpdateTeamMemberDTO,
      TeamMember,
} from "./team-member.validations";
import {
      getCache,
      setCache,
      deleteCache,
      clearCacheByPrefix,
} from "../../config/redis/redis.services";

// Constant value for cache timeout
const DEFAULT_CACHE_TIME_TO_LIVE = 60000;

// Validate Response
export const toTeamMemberResponse = (teamMember: TeamMember) => teamMember;

export const createTeamMemberService = async (data: CreateTeamMemberDTO) => {
      if (await getTeamMemberBySlug(data.slug)) {
            throw new AppError(409, "Team member slug already exists");
      }

      if (data.profileMediaId && !(await getMediaById(data.profileMediaId))) {
            throw new AppError(
                  400,
                  "profileMediaId must reference existing media",
            );
      }

      await clearCacheByPrefix("team-members:");
      return insertTeamMember(data);
};

export const getTeamMembersService = async (pagination: Pagination) => {
      const cacheKey = `team-members:${pagination.page}:${pagination.limit}`;

      // Check Cache
      const cachedMember = await getCache<{
            teamMembers: TeamMember[];
            pagination: ReturnType<typeof getPaginationMeta>;
      }>(cacheKey);

      if (cachedMember) return cachedMember;

      // Cache Miss
      const [teamMembers, total] = await Promise.all([
            getTeamMembers(pagination),
            countTeamMembers(),
      ]);

      const res = {
            teamMembers,
            pagination: getPaginationMeta(pagination, total),
      };

      await setCache(cacheKey, res, DEFAULT_CACHE_TIME_TO_LIVE);
      return res;
};

export const getTeamMemberByIdService = async (id: string) => {
      const cacheKey = `team-members:${id}`;
      const cached = await getCache<TeamMember>(cacheKey);
      if (cacheKey) return cached;

      const teamMember = await getTeamMemberById(id);
      if (!teamMember) {
            throw new AppError(404, "Team member not found");
      }

      const res = toTeamMemberResponse(teamMember);
      await setCache(cacheKey, res, DEFAULT_CACHE_TIME_TO_LIVE);

      return res;
};

export const getTeamMemberBySlugService = async (slug: string) => {
      const cacheKey = `team-members:${slug}`;
      const cached = await getCache<TeamMember>(cacheKey);
      if (cached) return cached;

      const teamMember = await getTeamMemberBySlug(slug);
      if (!teamMember) {
            throw new AppError(404, "Team member not found");
      }

      const res = toTeamMemberResponse(teamMember);
      await setCache(cacheKey, res, DEFAULT_CACHE_TIME_TO_LIVE);

      return res;
};

export const updateTeamMemberService = async (
      id: string,
      data: UpdateTeamMemberDTO,
) => {
      const teamMember = await getTeamMemberById(id);

      if (!teamMember) {
            throw new AppError(404, "Team member not found");
      }

      if (data.slug && data.slug !== teamMember.slug) {
            const existingTeamMember = await getTeamMemberBySlug(data.slug);

            if (existingTeamMember) {
                  throw new AppError(409, "Team member slug already exists");
            }
      }

      if (data.profileMediaId && !(await getMediaById(data.profileMediaId))) {
            throw new AppError(
                  400,
                  "profileMediaId must reference existing media",
            );
      }

      const updatedTeamMember = await updateTeamMember(id, {
            ...data,
            updatedAt: new Date(),
      });

      await deleteCache(`team-members:${id}`);
      await clearCacheByPrefix("team-members:");

      return toTeamMemberResponse(updatedTeamMember);
};

export const deleteTeamMemberService = async (id: string) => {
      const teamMember = await getTeamMemberById(id);

      if (!teamMember) {
            throw new AppError(404, "Team member not found");
      }

      if (await teamMemberHasEventSpeakerReferences(id)) {
            throw new AppError(
                  409,
                  "Team member cannot be deleted while assigned to events",
            );
      }

      await deleteCache(`team-members:${id}`);
      await clearCacheByPrefix("team-members:");
      await deleteTeamMember(id);
};
