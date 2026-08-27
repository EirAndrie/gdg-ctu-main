import { createClient } from "redis";
import logger from "../../utils/logger";
import { AppError } from "../../utils/http";

/**
 * The sole purpose of this function is to test connectivity to redis
 */
export const testRedisConnection = async () => {
      try {
            const client = createClient({
                  url: process.env.REDIS_URL,
            });

            await client.connect();
            const ping = await client.ping();

            if (ping === "PONG") {
                  logger.info("Redis Connection Established Successfully.");
            }

            // Safely close the connection since this is just a test.
            await client.disconnect();
            return true;
      } catch (error: any) {
            logger.error("Failed to Connect Redis", {
                  message: error.message,
                  stack: error.stack,
            });
            throw new AppError(
                  500,
                  "An Error has Occured: Failed to Establish Redis Connection",
            );
      }
};
