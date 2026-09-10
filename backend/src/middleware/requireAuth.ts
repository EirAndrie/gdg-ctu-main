import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { getAdminById } from "../modules/admins/models/admin.queries";

/**
 * Express middleware that blocks unauthenticated requests.
 *
 * Apply this once on a router (see `routes/index.ts` or `createProtectedRouter`)
 * instead of repeating auth checks on every route handler. It relies on
 * `clerkMiddleware()` being registered globally in `server.ts` so Clerk can
 * attach session data to each incoming request.
 *
 * @example
 * // Protect every route under a feature router
 * protectedRouter.use(requireAuth);
 * protectedRouter.use(subscribersRoutes);
 *
 * @example
 * // Protect a single route
 * router.get("/profile", requireAuth, getProfile);
 */
export async function requireAuth(
      req: Request,
      res: Response,
      next: NextFunction,
) {
      const { userId } = getAuth(req);

      if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
      }

      try {
            const admin = await getAdminById(userId);

            // Allow first-time users through so POST /auth/sync can create
            // their admin record. All other protected routes require sync
            // to have happened at least once.
            if (admin && admin.isActive === false) {
                  res.status(403).json({
                        error: "Account deactivated — contact tech/web officer",
                  });
                  return;
            }
      } catch {
            // If the admin lookup fails (e.g. DB blip), fail closed.
            res.status(503).json({ error: "Authentication service unavailable" });
            return;
      }

      next();
}
