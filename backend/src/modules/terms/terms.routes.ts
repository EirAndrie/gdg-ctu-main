import { Router } from "express";
import {
      createTerm,
      deleteTerm,
      getTerm,
      listTerms,
      updateTerm,
} from "./terms.controllers";
import { validateParams } from "../../middleware/validateParams";
import { validateQuery } from "../../middleware/validateQuery";

const router = Router();

router.post("/", createTerm);
router.get("/", validateQuery("page", "limit"), listTerms);
router.get("/:id", validateParams("id"), getTerm);
router.patch("/:id", validateParams("id"), updateTerm);
router.delete("/:id", validateParams("id"), deleteTerm);

export default router;
