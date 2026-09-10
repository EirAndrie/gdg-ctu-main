import { Router } from "express";

/** Liveness probe — replaces GET /admins as the deployment health check. */
const router = Router();

router.get("/", (_req, res) => {
      res.status(200).json({
            success: true,
            status: "ok",
            service: "gdg-ctu-backend",
            timestamp: new Date().toISOString(),
      });
});

export default router;
