import { Router } from "express";
import {
      getPublicFeaturedEvents,
      getPublicPastEvents,
      getPublicRecentEvents,
      getPublicUpcomingEvents,
      getPublishedEventBySlug,
} from "../events/models/event.queries";
import { AppError, getStringParam, handleControllerError } from "../../utils/http";

/**
 * Public events feed — no auth, published only.
 * ?scope=upcoming|past|featured|recent (default: upcoming).
 * Cutoff: endAt < now = past, else upcoming.
 */
const router = Router();

type Scope = "upcoming" | "past" | "featured" | "recent";

const SCOPES: Scope[] = ["upcoming", "past", "featured", "recent"];

router.get("/", async (req, res) => {
      try {
            const raw = String(req.query.scope ?? "upcoming");
            if (!SCOPES.includes(raw as Scope)) {
                  throw new AppError(
                        400,
                        "Invalid scope. Use upcoming|past|featured|recent.",
                  );
            }
            const scope = raw as Scope;
            const events =
                  scope === "past"
                        ? await getPublicPastEvents()
                        : scope === "featured"
                          ? await getPublicFeaturedEvents(3)
                          : scope === "recent"
                            ? await getPublicRecentEvents(3)
                            : await getPublicUpcomingEvents();
            return res.status(200).json({ success: true, scope, events });
      } catch (error) {
            return handleControllerError(res, error, "Failed to list public events");
      }
});

router.get("/slug/:slug", async (req, res) => {
      try {
            const slug = getStringParam(req.params.slug, "slug");
            const event = await getPublishedEventBySlug(slug);
            if (!event) {
                  throw new AppError(404, "Event not found");
            }
            return res.status(200).json({ success: true, event });
      } catch (error) {
            return handleControllerError(res, error, "Failed to get public event");
      }
});

export default router;
