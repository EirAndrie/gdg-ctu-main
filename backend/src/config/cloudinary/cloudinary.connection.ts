import cloudinary from "./cloudinary.config";
import logger from "../../utils/logger";
import { AppError } from "../../utils/http";

/**
 * The sole purpose of this function is to test connectivity to cloudinary
 */
export const testCloudinaryConnection = async () => {
      try {
            await cloudinary.api.ping();
            logger.info("Cloudinary Connected Successfully");
      } catch (error: any) {
            logger.error("Failed to Connect Cloudinary", {
                  message: error.message,
                  stack: error.stack,
            });
            throw new AppError(
                  500,
                  "An Error has Occured: Failed to Establish Cloudinary Connection",
            );
      }
};
