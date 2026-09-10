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
            const message = err instanceof Error ? err.message : String(err);
            throw new Error(`Failed to apply Drizzle migrations from ${migrationsFolder}: ${message}`);
      }
      await pool.query("SELECT 1");
      return logger.info("Server Connected to Database Successfully");
};
