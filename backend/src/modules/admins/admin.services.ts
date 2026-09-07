import { AppError } from "../../utils/http";
import { getPaginationMeta, Pagination } from "../../utils/pagination";
import {
      adminHasReferences,
      countAdmins,
      deleteAdmin,
      getAdminByEmail,
      getAdminById,
      getAdmins,
      insertAdmin,
      updateAdmin,
} from "./models/admin.queries";
import {
      AdminRecord,
      CreateAdminDTO,
      UpdateAdminDTO,
} from "./admin.validations";
import {
      getCache,
      setCache,
      deleteCache,
      clearCacheByPrefix,
} from "../../config/redis/redis.services";

// Constant value for cache timeout
const DEFAULT_CACHE_TIME_TO_LIVE = 60000;

export const toAdminResponse = (admin: AdminRecord) => {
      // Return only safe fields that are part of the public API.
      // The AdminRecord already does not contain a password, but we
      // explicitly pick the columns we want to expose. This keeps the
      // shape stable for consumers and makes it easy to extend later.
      return {
            id: admin.id,
            email: admin.email,
            isActive: admin.isActive,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
      } as const;
};

export const createAdminService = async (data: CreateAdminDTO) => {
      const existingAdmin = await getAdminByEmail(data.email);

      if (existingAdmin) {
            throw new AppError(409, "Admin email already exists");
      }

      const admin = await insertAdmin(data);

      await clearCacheByPrefix("admins:");
      return toAdminResponse(admin);
};

export const getAdminsService = async (pagination: Pagination) => {
      const cacheKey = `admins:${pagination.page}:${pagination.limit}`;

      // Check Cache
      const cached = await getCache<{
            admins: ReturnType<typeof toAdminResponse>[];
            pagination: ReturnType<typeof getPaginationMeta>;
      }>(cacheKey);

      if (cached) return cached;

      // Cache Miss
      const [admins, total] = await Promise.all([
            getAdmins(pagination),
            countAdmins(),
      ]);

      const res = {
            admins: admins.map(toAdminResponse),
            pagination: getPaginationMeta(pagination, total),
      };

      await setCache(cacheKey, res, DEFAULT_CACHE_TIME_TO_LIVE);
      return res;
};

export const getAdminByIdService = async (id: string) => {
      const cacheKey = `admins:${id}`;
      const cachedAdmin =
            await getCache<ReturnType<typeof toAdminResponse>>(cacheKey);
      if (cachedAdmin) return cachedAdmin;

      const admin = await getAdminById(id);
      if (!admin) {
            throw new AppError(404, "Admin not found");
      }

      const res = toAdminResponse(admin);
      await setCache(cacheKey, res, DEFAULT_CACHE_TIME_TO_LIVE);

      return res;
};

export const updateAdminService = async (id: string, data: UpdateAdminDTO) => {
      const admin = await getAdminById(id);

      if (!admin) {
            throw new AppError(404, "Admin not found");
      }

      if (data.email && data.email !== admin.email) {
            const existingAdmin = await getAdminByEmail(data.email);

            if (existingAdmin) {
                  throw new AppError(409, "Admin email already exists");
            }
      }

      const updatedAdmin = await updateAdmin(id, {
            ...data,
            updatedAt: new Date(),
      });

      await deleteCache(`admins:${id}`);
      await clearCacheByPrefix("admins:");

      return toAdminResponse(updatedAdmin);
};

export const deleteAdminService = async (id: string) => {
      const admin = await getAdminById(id);

      if (!admin) {
            throw new AppError(404, "Admin not found");
      }

      if (await adminHasReferences(id)) {
            throw new AppError(
                  409,
                  "Admin cannot be deleted while referenced by events, media, or site content",
            );
      }

      await deleteCache(`admins:${id}`);
      await clearCacheByPrefix("admins:");
      await deleteAdmin(id);
};
