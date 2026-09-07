import { Request, Response } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { upsertAdminByClerkId } from "../../modules/admins/models/admin.queries";
import { serializeAdmin } from "./serializeAdmin";
import logger from "../../utils/logger";
import { handleControllerError } from "../../utils/http";

/**
 * Sync the currently authenticated Clerk admin with the local admin table.
 */
export async function syncCurrentAdminUser(
      req: Request,
      res: Response,
): Promise<void> {
      try {
            const { userId } = getAuth(req);
            if (!userId) {
                  res.status(401).json({
                        success: false,
                        error: "Unauthorized",
                  });
                  return;
            }

            const clerkUser = await clerkClient.users.getUser(userId);

            const email =
                  clerkUser.primaryEmailAddress?.emailAddress ??
                  clerkUser.emailAddresses.find((ea) => ea.emailAddress)
                        ?.emailAddress;
            if (!email) {
                  res.status(422).json({
                        success: false,
                        message: "Authenticated Clerk user does not have a verified email address",
                  });
                  return;
            }

            const name =
                  clerkUser.fullName?.trim() ??
                  [clerkUser.firstName, clerkUser.lastName]
                        .filter(Boolean)
                        .join(" ") ??
                  clerkUser.username ??
                  email;

            const admin = await upsertAdminByClerkId({
                  id: userId,
                  email,
            });

            res.status(200).json({
                  success: true,
                  message: "Admin synced successfully",
                  admin: serializeAdmin(admin),
            });
      } catch (err: any) {
            logger.error("syncCurrentAdminUser failed", {
                  message: err.message,
                  stack: err.stack,
            });
            handleControllerError(
                  res,
                  err,
                  "Internaal Server Error: syncCurrentAdminUser Function Failed",
            );
      }
}
