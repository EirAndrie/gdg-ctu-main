import {
      boolean,
      integer,
      pgTable,
      timestamp,
      unique,
      uuid,
      varchar,
} from "drizzle-orm/pg-core";

import { teamMembers } from "../../team-members/models/team-member";
import { terms } from "../../terms/models/terms";

export const memberTerms = pgTable(
      "member_terms",
      {
            id: uuid("id").defaultRandom().primaryKey(),

            memberId: uuid("member_id")
                  .notNull()
                  .references(() => teamMembers.id, {
                        onDelete: "cascade",
                        onUpdate: "cascade",
                  }),

            termId: uuid("term_id")
                  .notNull()
                  .references(() => terms.id, {
                        onDelete: "cascade",
                        onUpdate: "cascade",
                  }),

            role: varchar("role", { length: 255 }).notNull(),

            displayOrder: integer("display_order").default(0).notNull(),

            isActive: boolean("is_active").default(true).notNull(),

            createdAt: timestamp("created_at").defaultNow().notNull(),

            updatedAt: timestamp("updated_at").defaultNow().notNull(),
      },

      (table) => [
            unique("member_terms_member_id_term_id_unique").on(
                  table.memberId,
                  table.termId,
            ),
      ],
);
