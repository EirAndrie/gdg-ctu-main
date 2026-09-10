import express from "express";
import { getCurrentAdminUser } from "./getCurrentAdminUser.controllers";
import { syncCurrentAdminUser } from "./syncCurrentAdminUser";

/**
 * Auth routes expose the currently signed-in Clerk user to the frontend.
 *
 * These routes are mounted under the protected API router in `routes/index.ts`,
 * so `requireAuth` runs before any handler here. `clerkMiddleware()` in
 * `server.ts` must also be registered globally so session data is available
 * on each request.
 */
const router = express.Router();

/**
 * Returns the full Clerk user profile for the authenticated session.
 *
 * Flow:
 * 1. `requireAuth` (applied upstream) rejects unauthenticated requests with 401.
 * 2. `getAuth(req)` reads the Clerk session attached by `clerkMiddleware()`.
 * 3. `clerkClient.users.getUser()` fetches the latest user record from Clerk.
 *
 * @route GET /me
 * @access Protected — requires a valid Clerk session
 */
router.get("/me", getCurrentAdminUser);
router.post("/sync", syncCurrentAdminUser);

export default router;
