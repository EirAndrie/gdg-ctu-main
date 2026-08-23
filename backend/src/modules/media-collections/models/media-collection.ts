import { integer, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { admins } from "../../admins/models/admin";
import { media } from "../../media/models/media"; // reference media module

export const mediaCollections = pgTable("media_collections", {
      id: uuid("id").defaultRandom().primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      slug: varchar("slug", { length: 255 }).notNull().unique(),
      description: text("description"),
      coverMediaId: uuid("cover_media_id").references(() => media.id),
      createdBy: uuid("created_by")
            .notNull()
            .references(() => admins.id),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
