import { Request, Response } from "express";
import {
      getPagination,
      handleControllerError,
      validateBody,
      validateUuid,
      AppError,
} from "../../utils/http";
import upload from "../../middleware/upload";
import {
      createMediaService,
      getMediaService,
      getMediaByIdService,
      updateMediaService,
      deleteMediaService,
} from "./media.services";
import { CreateMediaSchema, UpdateMediaSchema } from "./media.validations";
import { uploadMedia } from "../../config/cloudinary/cloudinary.services";

export const createMedia = async (req: Request, res: Response) => {
      try {
            // Validate non‑file fields (uploadedBy, altText)
            const data = validateBody(CreateMediaSchema, req.body);

            const file = (req as any).file;
            if (!file) {
                  return res
                        .status(400)
                        .json({ success: false, message: "File is required" });
            }

            const uploadResult = await uploadMedia(file.buffer, {
                  folder: "media",
                  resourceType: "auto",
            });

            const mediaData = {
                  uploadedBy: data.uploadedBy,
                  altText: data.altText ?? null,
                  cloudinaryAssetId: uploadResult.asset_id,
                  publicId: uploadResult.public_id,
                  secureUrl: uploadResult.secure_url,
                  resourceType: uploadResult.resource_type,
                  format: uploadResult.format,
                  width: uploadResult.width,
                  height: uploadResult.height,
                  bytes: uploadResult.bytes,
                  originalFilename: uploadResult.original_filename,
            };

            const media = await createMediaService(mediaData as any);
            return res.status(201).json({
                  success: true,
                  message: "Media created successfully",
                  media,
            });
      } catch (error) {
            return handleControllerError(res, error, "Failed to create media");
      }
};

export const listMedia = async (req: Request, res: Response) => {
      try {
            const paginationQuery = getPagination(req.query);
            const { media, pagination } =
                  await getMediaService(paginationQuery);
            return res.status(200).json({ success: true, media, pagination });
      } catch (error) {
            return handleControllerError(res, error, "Failed to list media");
      }
};

export const getMedia = async (req: Request, res: Response) => {
      try {
            const id = validateUuid(req.params.id);
            const media = await getMediaByIdService(id);
            return res.status(200).json({ success: true, media });
      } catch (error) {
            return handleControllerError(res, error, "Failed to get media");
      }
};

export const updateMedia = async (req: Request, res: Response) => {
      try {
            const id = validateUuid(req.params.id);
            const data = validateBody(UpdateMediaSchema, req.body);
            const media = await updateMediaService(id, data as any);
            return res.status(200).json({
                  success: true,
                  message: "Media updated successfully",
                  media,
            });
      } catch (error) {
            return handleControllerError(res, error, "Failed to update media");
      }
};

export const removeMedia = async (req: Request, res: Response) => {
      try {
            const id = validateUuid(req.params.id);
            await deleteMediaService(id);
            return res.status(200).json({
                  success: true,
                  message: "Media deleted successfully",
            });
      } catch (error) {
            return handleControllerError(res, error, "Failed to delete media");
      }
};
