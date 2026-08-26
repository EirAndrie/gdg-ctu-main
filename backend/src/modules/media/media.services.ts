import {
      uploadMedia,
      deleteMedia as cloudinaryDeleteMedia,
} from "../../config/cloudinary/cloudinary.services";
import { AppError } from "../../utils/http";
import { getAdminById } from "../admins/models/admin.queries";
import { getPaginationMeta, Pagination } from "../../utils/pagination";
import {
      countMedia,
      deleteMedia,
      getMedia,
      getMediaById,
      insertMedia,
      mediaHasReferences,
      updateMedia,
} from "./models/media.queries";
import { UpdateMediaDTO } from "./media.validations";

export const createMediaService = async (data: any) => {
      if (!(await getAdminById(data.uploadedBy))) {
            throw new AppError(
                  400,
                  "uploadedBy must reference an existing admin",
            );
      }
      return insertMedia(data);
};

export const getMediaService = async (pagination: Pagination) => {
      const [media, total] = await Promise.all([
            getMedia(pagination),
            countMedia(),
      ]);

      return {
            media,
            pagination: getPaginationMeta(pagination, total),
      };
};

export const getMediaByIdService = async (id: string) => {
      const media = await getMediaById(id);

      if (!media) {
            throw new AppError(404, "Media not found");
      }

      return media;
};

export const updateMediaService = async (id: string, data: UpdateMediaDTO) => {
      const media = await getMediaById(id);

      if (!media) {
            throw new AppError(404, "Media not found");
      }

      if (data.uploadedBy && !(await getAdminById(data.uploadedBy))) {
            throw new AppError(
                  400,
                  "uploadedBy must reference an existing admin",
            );
      }
      return updateMedia(id, data);
};

export const deleteMediaService = async (id: string) => {
      const media = await getMediaById(id);

      if (!media) {
            throw new AppError(404, "Media not found");
      }

      if (await mediaHasReferences(id)) {
            throw new AppError(
                  409,
                  "Media cannot be deleted while referenced by team members, event speakers, events, or site content",
            );
      }

      // Delete from Cloudinary using publicId and resourceType
      await cloudinaryDeleteMedia(
            media.publicId,
            media.resourceType as "image" | "video" | "raw",
      );
      await deleteMedia(id);
};
