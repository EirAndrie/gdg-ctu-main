import { Router } from "express";
import {
      getActiveMediaCollectionBySlug,
      getActiveMediaCollections,
} from "../media-collections/models/media-collection.queries";
import {
      getFeaturedCollectionItems,
      getItemsByCollectionId,
} from "../media-collection-items/models/media-collection-item.queries";
import { AppError, getStringParam, handleControllerError } from "../../utils/http";

/**
 * Public gallery feed — no auth, active albums only, items ordered.
 * Featured strip capped at 10 (UI target 8, hard cap 10).
 */
const router = Router();

const MAX_FEATURED = 10;

router.get("/albums", async (_req, res) => {
      try {
            const albums = await getActiveMediaCollections();
            return res.status(200).json({ success: true, albums });
      } catch (error) {
            return handleControllerError(res, error, "Failed to list public albums");
      }
});

router.get("/albums/slug/:slug", async (req, res) => {
      try {
            const slug = getStringParam(req.params.slug, "slug");
            const album = await getActiveMediaCollectionBySlug(slug);
            if (!album) {
                  throw new AppError(404, "Album not found");
            }
            const items = await getItemsByCollectionId(album.id);
            return res.status(200).json({ success: true, album, items });
      } catch (error) {
            return handleControllerError(res, error, "Failed to get public album");
      }
});

router.get("/featured", async (req, res) => {
      try {
            const requested = Number(req.query.limit ?? 8);
            const limit = Number.isFinite(requested)
                  ? Math.min(Math.max(requested, 1), MAX_FEATURED)
                  : 8;
            const photos = await getFeaturedCollectionItems(limit);
            return res.status(200).json({ success: true, photos });
      } catch (error) {
            return handleControllerError(
                  res,
                  error,
                  "Failed to list featured photos",
            );
      }
});

export default router;
