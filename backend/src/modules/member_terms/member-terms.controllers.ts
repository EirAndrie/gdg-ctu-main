import { Request, Response } from "express";
import {
      getPagination,
      handleControllerError,
      validateBody,
      validateUuid,
      AppError,
      getStringParam,
} from "../../utils/http";
import {
      createMemberTermService,
      getMemberTermsService,
      getMemberTermByIdService,
      getTeamMembersByTerm,
      updateMemberTermService,
      deleteMemberTermService,
} from "./member-terms.services";
import {
      CreateMemberTermsSchema,
      UpdateMemberTermSchema,
} from "./member-terms.validations";
import logger from "../../utils/logger";

export const createMemberTerm = async (req: Request, res: Response) => {
      try {
            const data = validateBody(CreateMemberTermsSchema, req.body);
            const memberTerm = await createMemberTermService(data);
            return res.status(201).json({ success: true, memberTerm });
      } catch (error) {
            return handleControllerError(
                  res,
                  error,
                  "Failed to create member term",
            );
      }
};

export const listMemberTerms = async (req: Request, res: Response) => {
      try {
            const pagination = getPagination(req.query);
            const { memberTerms, pagination: meta } =
                  await getMemberTermsService(pagination);
            return res
                  .status(200)
                  .json({ success: true, memberTerms, pagination: meta });
      } catch (error) {
            return handleControllerError(
                  res,
                  error,
                  "Failed to list member terms",
            );
      }
};

export const getMemberTerm = async (req: Request, res: Response) => {
      try {
            const id = validateUuid(req.params.id);
            const memberTerm = await getMemberTermByIdService(id);
            return res.status(200).json({ success: true, memberTerm });
      } catch (error) {
            return handleControllerError(
                  res,
                  error,
                  "Failed to get member term",
            );
      }
};

export const listMembersForTerm = async (req: Request, res: Response) => {
      try {
            // Accept either a term‑id (UUID) or a slug – you decide which you prefer
            const { termId, slug } = req.query as {
                  termId?: string;
                  slug?: string;
            };

            let termIdentifier: string;
            if (termId) {
                  termIdentifier = getStringParam(termId, "termId");
            } else if (slug) {
                  termIdentifier = getStringParam(slug, "slug");
            } else {
                  throw new AppError(
                        400,
                        "You must supply either termId or slug",
                  );
            }

            const pagination = getPagination(req.query);
            const result = await getTeamMembersByTerm(
                  termIdentifier,
                  pagination,
            );

            return res.status(200).json({ success: true, ...result });
      } catch (error: any) {
            return handleControllerError(
                  res,
                  error,
                  "Failed to list members for term",
            );
      }
};

export const updateMemberTerm = async (req: Request, res: Response) => {
      try {
            const id = validateUuid(req.params.id);
            const data = validateBody(UpdateMemberTermSchema, req.body);
            const memberTerm = await updateMemberTermService(id, data);
            return res.status(200).json({ success: true, memberTerm });
      } catch (error) {
            return handleControllerError(
                  res,
                  error,
                  "Failed to update member term",
            );
      }
};

export const deleteMemberTerm = async (req: Request, res: Response) => {
      try {
            const id = validateUuid(req.params.id);
            await deleteMemberTermService(id);
            return res
                  .status(200)
                  .json({ success: true, message: "Member term deleted" });
      } catch (error) {
            return handleControllerError(
                  res,
                  error,
                  "Failed to delete member term",
            );
      }
};
