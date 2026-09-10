import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import adminRoutes from "./admins/admin.routes";
import authRoutes from "./auth/auth.routes";
import eventHostRoutes from "./event-hosts/event-hosts.routes";
import eventAttendeeRoutes from "./event-attendees/event-attendees.routes";
import eventRoutes from "./events/event.routes";
import mediaCollectionRoutes from "./media-collections/media-collections.routes";
import mediaCollectionItemRoutes from "./media-collection-items/media-collection-items.routes";
import mediaRoutes from "./media/media.routes";
import teamMemberRoutes from "./team-members/team-member.routes";
import eventSpeakerRoutes from "./event-speakers/event-speaker.routes";
import termsRoutes from "./terms/terms.routes";
import memberTermsRoutes from "./member_terms/member-terms.routes";

const router = Router();
const protectedRouter = Router();

protectedRouter.use(requireAuth);
router.use("/admins", adminRoutes);
router.use("/auth", authRoutes);
router.use("/team-members", teamMemberRoutes);
router.use("/events", eventRoutes);
router.use("/media", mediaRoutes);
router.use("/event-speakers", eventSpeakerRoutes);
router.use("/event-hosts", eventHostRoutes);
router.use("/event-attendees", eventAttendeeRoutes);
router.use("/media-collections", mediaCollectionRoutes);
router.use("/media-collection-items", mediaCollectionItemRoutes);
router.use("/terms", termsRoutes);
router.use("/member-terms", memberTermsRoutes);
router.use(protectedRouter);

export default router;
