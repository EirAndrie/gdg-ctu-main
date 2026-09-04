import { Router } from "express";
import {
      createMemberTerm,
      listMemberTerms,
      getMemberTerm,
      updateMemberTerm,
      deleteMemberTerm,
} from "./member-terms.controllers";
import { validateParams } from "../../middleware/validateParams";
import { validateQuery } from "../../middleware/validateQuery";

const router = Router();

router.post("/", createMemberTerm);
router.get("/", validateQuery("page", "limit"), listMemberTerms);
router.get("/:id", validateParams("id"), getMemberTerm);
router.patch("/:id", validateParams("id"), updateMemberTerm);
router.delete("/:id", validateParams("id"), deleteMemberTerm);

export default router;
