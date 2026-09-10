import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import path from "path";
import fs from "fs";
import ENV from "./env";
import logger from "../utils/logger";
import * as schema from "../modules";

export const pool = new Pool({
      connectionString: ENV.DB_URL,
});

export const db = drizzle({
      client: pool,
      schema,
});

export const connectDB = async () => {
      const cwdMigrationsFolder = path.resolve(process.cwd(), "drizzle");
      const distRelativeMigrationsFolder = path.resolve(__dirname, "../../drizzle");
      const migrationsFolder = fs.existsSync(cwdMigrationsFolder)
            ? cwdMigrationsFolder
            : distRelativeMigrationsFolder;
      try {
            logger.info(`Applying Drizzle migrations from ${migrationsFolder}...`);
            await migrate(db, { migrationsFolder });
            logger.info("Drizzle migrations applied successfully");
      } catch (err) {
            const cause = err instanceof Error ? err.cause : undefined;
            const field = (obj: unknown, key: string) =>
                  obj !== null && typeof obj === "object"
                        ? (obj as Record<string, unknown>)[key]
                        : undefined;
            logger.error("Failed to apply Drizzle migrations:", {
                  migrationsFolder,
                  message: err instanceof Error ? err.message : String(err),
                  code: field(err, "code") ?? field(cause, "code"),
                  detail: field(err, "detail") ?? field(cause, "detail"),
                  hint: field(err, "hint") ?? field(cause, "hint"),
                  constraint: field(err, "constraint") ?? field(cause, "constraint"),
                  table: field(err, "table") ?? field(cause, "table"),
                  column: field(err, "column") ?? field(cause, "column"),
                  cause:
                        cause instanceof Error
                              ? { message: cause.message, stack: cause.stack }
                              : cause,
                  stack: err instanceof Error ? err.stack : undefined,
            });
            const message = err instanceof Error ? err.message : String(err);
            throw new Error(`Failed to apply Drizzle migrations from ${migrationsFolder}: ${message}`);
      }
      await pool.query("SELECT 1");
      return logger.info("Server Connected to Database Successfully");
};
