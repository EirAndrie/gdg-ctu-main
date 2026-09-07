import { boolean, timestamp, varchar, text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

/**
 * Admin table stores Clerk user IDs as primary keys.
 * The `id` column directly holds the Clerk ID (string) and is the PK.
 */
export const admins = pgTable("admins", {
      // Clerk ID will be the primary key (string).
      id: varchar("id", { length: 255 }).primaryKey(),
      email: varchar("email", { length: 255 }).notNull().unique(),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
