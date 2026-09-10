import { relations } from "drizzle-orm";
import { media } from "../../media/models/media";
import { partners } from "./partner";

export const partnersRelations = relations(partners, ({ one }) => ({
      logoMedia: one(media, {
            fields: [partners.logoMediaId],
            references: [media.id],
      }),
}));
