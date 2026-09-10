import { and, eq } from "drizzle-orm";
import type { Column } from "drizzle-orm";

/**
 * Shared predicates for the public (published/active-only) CMS feeds.
 * Covers the getActiveX / getActiveXBySlug pairs in the team, collection,
 * content and partner query modules.
 */

/** `is_active = true`. */
export const activeOnly = (isActiveCol: Column) => eq(isActiveCol, true);

/** `<key> = value AND is_active = true` (slug or sectionKey lookups). */
export const activeByKey = (
      keyCol: Column,
      isActiveCol: Column,
      value: string,
) => and(eq(keyCol, value), eq(isActiveCol, true));
