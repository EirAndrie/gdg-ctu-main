import { AppError } from "../../utils/http";
import { getPaginationMeta, Pagination } from "../../utils/pagination";
import { getAdminById } from "../admins/models/admin.queries";
import { getMediaById } from "../media/models/media.queries";
import {
      insertMediaCollection,
      getMediaCollections,
      countMediaCollections,
      getMediaCollectionById,
      updateMediaCollection,
      deleteMediaCollection,
} from "./models/media-collection.queries";
import { CreateMediaCollectionDTO } from "./media-collections.validations";

export const toMediaCollectionResponse = (col: any) => col; // no sensitive fields

export const createMediaCollectionService = async (
      data: CreateMediaCollectionDTO,
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
      const col = await insertMediaCollection(data);
      return toMediaCollectionResponse(col);
};

export const listMediaCollectionsService = async (pagination: Pagination) => {
      const [collections, total] = await Promise.all([
            getMediaCollections(pagination),
            countMediaCollections(),
      ]);
      return {
            collections: collections.map(toMediaCollectionResponse),
            pagination: getPaginationMeta(pagination, total),
      };
};

export const getMediaCollectionService = async (id: string) => {
      const col = await getMediaCollectionById(id);
      if (!col) {
            throw new AppError(404, "Media collection not found");
      }
      return toMediaCollectionResponse(col);
};

export const updateMediaCollectionService = async (
      id: string,
      data: Partial<CreateMediaCollectionDTO>,
) => {
      const existing = await getMediaCollectionById(id);
      if (!existing) {
            throw new AppError(404, "Media collection not found");
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
      const updated = await updateMediaCollection(id, data);
      return toMediaCollectionResponse(updated);
};

export const deleteMediaCollectionService = async (id: string) => {
      const existing = await getMediaCollectionById(id);
      if (!existing) {
            throw new AppError(404, "Media collection not found");
      }
      // Optional: could check for items referencing collection before delete
      await deleteMediaCollection(id);
};
