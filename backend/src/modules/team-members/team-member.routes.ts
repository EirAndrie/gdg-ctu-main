import { Router } from "express";
import upload from "../../middleware/upload";
import {
      createTeamMemberWithImage,
      listTeamMembers,
      getTeamMember,
      getTeamMemberBySlug,
      updateTeamMember,
      removeTeamMember,
} from "./team-member.controllers";

const router = Router();

router.post("/", upload.single("file"), createTeamMemberWithImage);
router.get("/", listTeamMembers);
router.get("/slug/:slug", getTeamMemberBySlug);
router.get("/:id", getTeamMember);
router.patch("/:id", upload.single("file"), updateTeamMember);

router.delete("/:id", removeTeamMember);
export default router;
