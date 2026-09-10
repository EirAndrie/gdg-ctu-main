import { Router } from "express";
import {
      createPartner,
      getPartner,
      getPartnerBySlug,
      listPartners,
      removePartner,
      updatePartner,
} from "./partner.controllers";

const router = Router();

router.post("/", createPartner);
router.get("/", listPartners);
router.get("/slug/:slug", getPartnerBySlug);
router.get("/:id", getPartner);
router.patch("/:id", updatePartner);
router.delete("/:id", removePartner);

export default router;
