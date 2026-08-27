import {
      boolean,
      date,
      pgTable,
      timestamp,
      uuid,
      varchar,
} from "drizzle-orm/pg-core";

export const terms = pgTable("terms", {
      id: uuid("id").defaultRandom().primaryKey(),
      name: varchar("name", { length: 20 }).notNull().unique(),

      startDate: date("start_date", {
            mode: "date",
      }).notNull(),
      endDate: date("end_date", {
            mode: "date",
      }).notNull(),

      isCurrent: boolean("is_current").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
