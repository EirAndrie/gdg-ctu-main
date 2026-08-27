import { AppError } from "../../utils/http";
import { getPaginationMeta, Pagination } from "../../utils/pagination";
import { getMediaById } from "../media/models/media.queries";
import { getTeamMemberById } from "../team-members/models/team-member.queries";
import {
      countEventSpeakers,
      countEventSpeakersByTeamMemberId,
      deleteEventSpeaker,
      getEventSpeakerById,
      getEventSpeakerBySlug,
      getEventSpeakers,
      getEventSpeakersByTeamMemberId,
      insertEventSpeaker,
      updateEventSpeaker,
} from "./models/event-speaker.queries";
import {
      CreateEventSpeakerDTO,
      UpdateEventSpeakerDTO,
      EventSpeaker,
} from "./event-speaker.validations";
import {
      getCache,
      setCache,
      deleteCache,
      clearCacheByPrefix,
} from "../../config/redis/redis.services";

// Constant value for cache timeout
const DEFAULT_CACHE_TIME_TO_LIVE = 60000;

const validateEventSpeakerReferences = async (
      data: Partial<
            Pick<CreateEventSpeakerDTO, "profileMediaId" | "teamMemberId">
      >,
) => {
      if (data.profileMediaId && !(await getMediaById(data.profileMediaId))) {
            throw new AppError(
                  400,
                  "profileMediaId must reference existing media",
            );
      }

      if (data.teamMemberId && !(await getTeamMemberById(data.teamMemberId))) {
            throw new AppError(
                  400,
                  "teamMemberId must reference an existing team member",
            );
      }
};

export const createEventSpeakerService = async (
      data: CreateEventSpeakerDTO,
) => {
      if (await getEventSpeakerBySlug(data.slug)) {
            throw new AppError(409, "Event speaker slug already exists");
      }

      await validateEventSpeakerReferences(data);

      await clearCacheByPrefix("speakers:");
      return insertEventSpeaker(data);
};

export const getEventSpeakersService = async (pagination: Pagination) => {
      const cacheKey = `speakers:${pagination.page}:${pagination.limit}`;

      // Check Cache
      const cached = await getCache<{
            eventSpeakers: EventSpeaker[];
            pagination: ReturnType<typeof getPaginationMeta>;
      }>(cacheKey);

      if (cached) return cached;

      // Cache Miss
      const [eventSpeakers, total] = await Promise.all([
            getEventSpeakers(pagination),
            countEventSpeakers(),
      ]);

      const res = {
            eventSpeakers,
            pagination: getPaginationMeta(pagination, total),
      };

      await setCache(cacheKey, res, DEFAULT_CACHE_TIME_TO_LIVE);
      return res;
};

export const getEventSpeakerByIdService = async (id: string) => {
      const cacheKey = `speakers:${id}`;
      const cachedSpeaker = await getCache<EventSpeaker>(cacheKey);
      if (cachedSpeaker) return cachedSpeaker;

      const eventSpeaker = await getEventSpeakerById(id);
      if (!eventSpeaker) {
            throw new AppError(404, "Event speaker not found");
      }

      await setCache(cacheKey, eventSpeaker, DEFAULT_CACHE_TIME_TO_LIVE);
      return eventSpeaker;
};

export const getEventSpeakerBySlugService = async (slug: string) => {
      const cacheKey = `speakers:${slug}`;
      const cachedSpeakerSlug = await getCache<EventSpeaker>(cacheKey);
      if (cachedSpeakerSlug) return cachedSpeakerSlug;

      const eventSpeaker = await getEventSpeakerBySlug(slug);
      if (!eventSpeaker) {
            throw new AppError(404, "Event speaker not found");
      }

      await setCache(cacheKey, eventSpeaker, DEFAULT_CACHE_TIME_TO_LIVE);
      return eventSpeaker;
};

export const getEventSpeakersByTeamMemberIdService = async (
      teamMemberId: string,
      pagination: Pagination,
) => {
      if (!(await getTeamMemberById(teamMemberId))) {
            throw new AppError(404, "Team member not found");
      }

      const cacheKey = `speaker:${teamMemberId}:${pagination.page}:${pagination.limit}`;

      // Check Cache
      const cached = await getCache<{
            eventSpeakers: EventSpeaker[];
            pagination: ReturnType<typeof getPaginationMeta>;
      }>(cacheKey);

      if (cached) return cached;

      // Cache Miss
      const [eventSpeakers, total] = await Promise.all([
            getEventSpeakersByTeamMemberId(teamMemberId, pagination),
            countEventSpeakersByTeamMemberId(teamMemberId),
      ]);

      const res = {
            eventSpeakers,
            pagination: getPaginationMeta(pagination, total),
      };

      await setCache(cacheKey, res, DEFAULT_CACHE_TIME_TO_LIVE);
      return res;
};

export const updateEventSpeakerService = async (
      id: string,
      data: UpdateEventSpeakerDTO,
) => {
      const eventSpeaker = await getEventSpeakerById(id);

      if (!eventSpeaker) {
            throw new AppError(404, "Event speaker not found");
      }

      if (data.slug && data.slug !== eventSpeaker.slug) {
            const existingEventSpeaker = await getEventSpeakerBySlug(data.slug);

            if (existingEventSpeaker) {
                  throw new AppError(409, "Event speaker slug already exists");
            }
      }

      await validateEventSpeakerReferences(data);

      await deleteCache(`speakers:${id}`);
      await clearCacheByPrefix(`speakers:`);

      return updateEventSpeaker(id, {
            ...data,
            updatedAt: new Date(),
      });
};

export const deleteEventSpeakerService = async (id: string) => {
      const eventSpeaker = await getEventSpeakerById(id);

      if (!eventSpeaker) {
            throw new AppError(404, "Event speaker not found");
      }

      await deleteCache(`speakers:${id}`);
      await clearCacheByPrefix("speakers:");
      await deleteEventSpeaker(id);
};
