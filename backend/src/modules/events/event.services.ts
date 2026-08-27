import { AppError } from "../../utils/http";
import { getPaginationMeta, Pagination } from "../../utils/pagination";
import { getAdminById } from "../admins/models/admin.queries";
import { getMediaById } from "../media/models/media.queries";
import { EventStatus } from "./models/event";
import {
      countEvents,
      deleteEvent,
      getEventById,
      getEventBySlug,
      getEvents,
      insertEvent,
      NewEventRecord,
      updateEvent,
} from "./models/event.queries";
import { CreateEventDTO, UpdateEventDTO, Event } from "./event.validations";
import {
      getCache,
      setCache,
      deleteCache,
      clearCacheByPrefix,
} from "../../config/redis/redis.services";

// Constant value for cache timeout
const DEFAULT_CACHE_TIME_TO_LIVE = 60000;

// HELPER VALIDATION FUNCTIONS
const getPublishedAtForStatus = (
      status: EventStatus | undefined,
      existingPublishedAt?: Date | null,
) => {
      if (!status) {
            return undefined;
      }

      if (status === "published") {
            return existingPublishedAt ?? new Date();
      }

      return null;
};

const validateEventReferences = async (
      data: Pick<CreateEventDTO, "createdBy"> &
            Partial<Pick<CreateEventDTO, "coverMediaId">>,
) => {
      if (!(await getAdminById(data.createdBy))) {
            throw new AppError(
                  400,
                  "createdBy must reference an existing admin",
            );
      }

      if (data.coverMediaId && !(await getMediaById(data.coverMediaId))) {
            throw new AppError(
                  400,
                  "coverMediaId must reference existing media",
            );
      }
};

// MAIN SERVICE FUNCTIONS
export const createEventService = async (data: CreateEventDTO) => {
      if (await getEventBySlug(data.slug)) {
            throw new AppError(409, "Event slug already exists");
      }

      await validateEventReferences(data);

      const eventData: NewEventRecord = {
            ...data,
            publishedAt: getPublishedAtForStatus(data.status),
      };

      await clearCacheByPrefix("events:");
      return insertEvent(eventData);
};

export const getEventsService = async (pagination: Pagination) => {
      const cacheKey = `events:${pagination.page}:${pagination.limit}`;

      // Check Cache
      const cached = await getCache<{
            events: Event[];
            pagination: ReturnType<typeof getPaginationMeta>;
      }>(cacheKey);

      if (cached) return cached;

      // Cache Miss
      const [events, total] = await Promise.all([
            getEvents(pagination),
            countEvents(),
      ]);

      const res = {
            events,
            pagination: getPaginationMeta(pagination, total),
      };

      await setCache(cacheKey, res, DEFAULT_CACHE_TIME_TO_LIVE);
      return res;
};

export const getEventByIdService = async (id: string) => {
      const cacheKey = `events:${id}`;
      const cachedEvent = await getCache<Event>(cacheKey);
      if (cachedEvent) return cachedEvent;

      const event = await getEventById(id);
      if (!event) {
            throw new AppError(404, "Event not found");
      }

      await setCache(cacheKey, event, DEFAULT_CACHE_TIME_TO_LIVE);
      return event;
};

export const getEventBySlugService = async (slug: string) => {
      const cacheKey = `events:${slug}`;
      const cachedEvent = await getCache<Event>(cacheKey);
      if (cachedEvent) return cachedEvent;

      const event = await getEventBySlug(slug);
      if (!event) {
            throw new AppError(404, "Event not found");
      }

      await setCache(cacheKey, event, DEFAULT_CACHE_TIME_TO_LIVE);
      return event;
};

export const updateEventService = async (id: string, data: UpdateEventDTO) => {
      const event = await getEventById(id);

      if (!event) {
            throw new AppError(404, "Event not found");
      }

      if (data.slug && data.slug !== event.slug) {
            const existingEvent = await getEventBySlug(data.slug);

            if (existingEvent) {
                  throw new AppError(409, "Event slug already exists");
            }
      }

      if (data.createdBy && !(await getAdminById(data.createdBy))) {
            throw new AppError(
                  400,
                  "createdBy must reference an existing admin",
            );
      }

      if (data.coverMediaId && !(await getMediaById(data.coverMediaId))) {
            throw new AppError(
                  400,
                  "coverMediaId must reference existing media",
            );
      }

      const startAt = data.startAt ?? event.startAt;
      const endAt = data.endAt ?? event.endAt;

      if (endAt < startAt) {
            throw new AppError(400, "endAt must not be earlier than startAt");
      }

      const eventUpdate: Partial<NewEventRecord> = {
            ...data,
            updatedAt: new Date(),
      };
      const publishedAt = getPublishedAtForStatus(
            data.status,
            event.publishedAt,
      );

      if (publishedAt !== undefined) {
            eventUpdate.publishedAt = publishedAt;
      }

      const updatedEvent = await updateEvent(id, eventUpdate);

      await deleteCache(`events:${id}`);
      await clearCacheByPrefix(`events:`);
      return updatedEvent;
};

export const deleteEventService = async (id: string) => {
      const event = await getEventById(id);

      if (!event) {
            throw new AppError(404, "Event not found");
      }

      await deleteCache(`events:${id}`);
      await clearCacheByPrefix(`events:`);
      await deleteEvent(id);
};
