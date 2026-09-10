import { Router } from "express";
import { getPublicPartnersService } from "../partners/partner.services";
import { handleControllerError } from "../../utils/http";

/** Public partners feed — no auth, active only, tier-ordered. */
const router = Router();

router.get("/", async (_req, res) => {
      try {
            const partners = await getPublicPartnersService();
            return res.status(200).json({ success: true, partners });
      } catch (error) {
            return handleControllerError(res, error, "Failed to list public partners");
      }
});

export default router;
