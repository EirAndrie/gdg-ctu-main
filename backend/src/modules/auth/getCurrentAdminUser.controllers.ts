import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { getAdminByClerkId } from "../admins/models/admin.queries";
import { serializeAdmin } from "./serializeAdmin";
import logger from "../../utils/logger";
import { handleControllerError } from "../../utils/http";

export async function getCurrentAdminUser(req: Request, res: Response) {
      try {
            const { userId } = getAuth(req);

            if (!userId) {
                  res.status(401).json({ error: "Unauthorized" });
                  return;
            }

            const [user] = await getAdminByClerkId(userId);
            if (!user) {
                  res.status(404).json({
                        success: false,
                        message: "Authenticated user has not been synced",
                  });
                  return;
            }

            res.json({
                  success: true,
                  message: "User fetched successfully",
                  user: serializeAdmin(user),
            });
      } catch (error: any) {
            logger.error(error, { message: error.message, stack: error.stack });
            handleControllerError(res, error, "Internal Server Error");
      }
}
