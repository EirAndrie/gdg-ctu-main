import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import {
      getPagination,
      getStringParam,
      handleControllerError as handleError,
      validateBody,
      validateUuid,
} from "../../utils/http";
import {
      createTeamMemberService,
      deleteTeamMemberService,
      getTeamMemberByIdService,
      getTeamMemberBySlugService,
      getTeamMembersService,
      updateTeamMemberService,
} from "./team-member.services";
import {
      CreateTeamMemberSchema,
      UpdateTeamMemberSchema,
} from "./team-member.validations";
import { NewTeamMemberRecord } from "./models/team-member.queries";

export const createTeamMemberWithImage = async (
      req: Request,
      res: Response,
) => {
      try {
            const file = (req as any).file;
            if (!file) {
                  return res.status(400).json({
                        success: false,
                        message: "Profile image is required",
                  });
            }

            const memberJson = req.body.member;
            if (!memberJson) {
                  return res.status(400).json({
                        success: false,
                        message: "`member` JSON payload missing",
                  });
            }

            const memberData: NewTeamMemberRecord = JSON.parse(memberJson);

            const auth = getAuth(req);
            const clerkId =
                  auth.userId ??
                  (req.body.uploadedBy
                        ? getStringParam(req.body.uploadedBy, "uploadedBy")
                        : undefined);

            if (!clerkId) {
                  return res.status(401).json({
                        success: false,
                        message: "Unable to determine uploader (Clerk ID)",
                  });
            }

            const teamMember = await createTeamMemberService({
                  memberData,
                  file: file.buffer,
                  uploadedBy: clerkId,
            });

            return res.status(201).json({
                  success: true,
                  message: "Team member with profile image created",
                  teamMember,
            });
      } catch (error: any) {
            return handleError(
                  res,
                  error,
                  "Failed to create team member with image",
            );
      }
};

export const listTeamMembers = async (req: Request, res: Response) => {
      try {
            const paginationQuery = getPagination(req.query);
            const { teamMembers, pagination } =
                  await getTeamMembersService(paginationQuery);
            return res
                  .status(200)
                  .json({ success: true, teamMembers, pagination });
      } catch (error: any) {
            return handleError(res, error, "Failed to list team members");
      }
};

export const getTeamMember = async (req: Request, res: Response) => {
      try {
            const id = validateUuid(req.params.id);
            const teamMember = await getTeamMemberByIdService(id);
            return res.status(200).json({ success: true, teamMember });
      } catch (error: any) {
            return handleError(res, error, "Failed to get team member");
      }
};

export const getTeamMemberBySlug = async (req: Request, res: Response) => {
      try {
            const slug = getStringParam(req.params.slug, "slug");
            const teamMember = await getTeamMemberBySlugService(slug);
            return res.status(200).json({ success: true, teamMember });
      } catch (error: any) {
            return handleError(res, error, "Failed to get team member");
      }
};

export const updateTeamMember = async (req: Request, res: Response) => {
      try {
            const id = validateUuid(req.params.id);
            const file = (req as any).file?.buffer;

            // ----------------------------------------------------------------
            // 1️⃣ Extract the JSON payload describing the fields to update.
            //    The client can send it either as a multipart field named `member`
            //    (raw JSON string) **or** as plain form‑fields directly (e.g.
            //    `firstName`, `lastName`, …). We support both for flexibility.
            // ----------------------------------------------------------------
            let payload: any;
            if (req.body.member) {
                  // `member` is a JSON string – parse it safely.
                  try {
                        payload = JSON.parse(req.body.member);
                  } catch (e) {
                        return res.status(400).json({
                              success: false,
                              message: "`member` JSON payload is malformed",
                        });
                  }
            } else {
                  // No JSON wrapper – treat the remaining body fields as the payload.
                  // Copy req.body and remove helper fields that are not part of the
                  // team‑member schema (e.g. `uploadedBy`).
                  payload = { ...req.body };
                  // Multer puts any non‑file fields here as strings.
                  delete payload.uploadedBy; // not part of the DTO
            }

            // Ensure we have at least one update field; otherwise Zod will throw.
            if (!payload || Object.keys(payload).length === 0) {
                  return res.status(400).json({
                        success: false,
                        message: "At least one field is required",
                  });
            }

            const data = validateBody(UpdateTeamMemberSchema, payload);

            const auth = getAuth(req);
            let clerkId;

            if (auth.userId !== null && auth.userId !== undefined) {
                  clerkId = auth.userId;
            } else if (req.body.uploadedBy) {
                  clerkId = getStringParam(req.body.uploadedBy, "uploadedBy");
            } else {
                  clerkId = undefined;
            }

            if (file && !clerkId) {
                  return res.status(401).json({
                        success: false,
                        message: "Unable to determine uploader (Clerk ID) for image upload",
                  });
            }

            const updated = await updateTeamMemberService({
                  id,
                  memberData: data,
                  file: file,
                  uploadedBy: clerkId ?? "",
            });
            return res.status(200).json({
                  success: true,
                  message: "Team member updated successfully",
                  teamMember: updated,
            });
      } catch (error) {
            return handleError(res, error, "Failed to update team member");
      }
};

export const removeTeamMember = async (req: Request, res: Response) => {
      try {
            const id = validateUuid(req.params.id);
            await deleteTeamMemberService(id);
            return res.status(200).json({
                  success: true,
                  message: "Team member deleted successfully",
            });
      } catch (error: any) {
            return handleError(res, error, "Failed to delete team member");
      }
};
