import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import {
      getPagination,
      getStringParam,
      handleControllerError,
      validateBody,
      validateUuid,
} from "../../utils/http";
import {
      createPartnerService,
      deletePartnerService,
      getPartnerByIdService,
      getPartnerBySlugService,
      getPartnersService,
      updatePartnerService,
} from "./partner.services";
import { CreatePartnerSchema, UpdatePartnerSchema } from "./partner.validations";

const getClerkId = (req: Request) => {
      const { userId } = getAuth(req);
      if (!userId) {
            return undefined;
      }
      return userId;
};

export const createPartner = async (req: Request, res: Response) => {
      try {
            const clerkId = getClerkId(req);
            if (!clerkId) {
                  return res.status(401).json({
                        success: false,
                        message: "Unable to determine uploader (Clerk ID)",
                  });
            }
            const data = validateBody(CreatePartnerSchema, req.body);
            const partner = await createPartnerService(data, clerkId);
            return res.status(201).json({
                  success: true,
                  message: "Partner created successfully",
                  partner,
            });
      } catch (error) {
            return handleControllerError(res, error, "Failed to create partner");
      }
};

export const listPartners = async (req: Request, res: Response) => {
      try {
            const paginationQuery = getPagination(req.query);
            const { partners, pagination } =
                  await getPartnersService(paginationQuery);
            return res.status(200).json({ success: true, partners, pagination });
      } catch (error) {
            return handleControllerError(res, error, "Failed to list partners");
      }
};

export const getPartner = async (req: Request, res: Response) => {
      try {
            const id = validateUuid(req.params.id);
            const partner = await getPartnerByIdService(id);
            return res.status(200).json({ success: true, partner });
      } catch (error) {
            return handleControllerError(res, error, "Failed to get partner");
      }
};

export const getPartnerBySlug = async (req: Request, res: Response) => {
      try {
            const slug = getStringParam(req.params.slug, "slug");
            const partner = await getPartnerBySlugService(slug);
            return res.status(200).json({ success: true, partner });
      } catch (error) {
            return handleControllerError(res, error, "Failed to get partner");
      }
};

export const updatePartner = async (req: Request, res: Response) => {
      try {
            const clerkId = getClerkId(req);
            if (!clerkId) {
                  return res.status(401).json({
                        success: false,
                        message: "Unable to determine uploader (Clerk ID)",
                  });
            }
            const id = validateUuid(req.params.id);
            const data = validateBody(UpdatePartnerSchema, req.body);
            const partner = await updatePartnerService(id, data, clerkId);
            return res.status(200).json({
                  success: true,
                  message: "Partner updated successfully",
                  partner,
            });
      } catch (error) {
            return handleControllerError(res, error, "Failed to update partner");
      }
};

export const removePartner = async (req: Request, res: Response) => {
      try {
            const id = validateUuid(req.params.id);
            await deletePartnerService(id);
            return res.status(200).json({
                  success: true,
                  message: "Partner deleted successfully",
            });
      } catch (error) {
            return handleControllerError(res, error, "Failed to delete partner");
      }
};
