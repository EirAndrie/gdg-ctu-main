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
import siteContentRoutes from "./site-content/site-content.routes";
import teamMemberRoutes from "./team-members/team-member.routes";
import eventSpeakerRoutes from "./event-speakers/event-speaker.routes";
import termsRoutes from "./terms/terms.routes";
import memberTermsRoutes from "./member_terms/member-terms.routes";

const router = Router();
const protectedRouter = Router();

protectedRouter.use(requireAuth);
router.use("/admins", adminRoutes);
protectedRouter.use("/auth", authRoutes);
protectedRouter.use("/team-members", teamMemberRoutes);
protectedRouter.use("/events", eventRoutes);
protectedRouter.use("/media", mediaRoutes);
protectedRouter.use("/site-content", siteContentRoutes);
protectedRouter.use("/event-speakers", eventSpeakerRoutes);
protectedRouter.use("/event-hosts", eventHostRoutes);
protectedRouter.use("/event-attendees", eventAttendeeRoutes);
protectedRouter.use("/media-collections", mediaCollectionRoutes);
protectedRouter.use("/media-collection-items", mediaCollectionItemRoutes);
protectedRouter.use("/terms", termsRoutes);
protectedRouter.use("/member-terms", memberTermsRoutes);
router.use(protectedRouter);

export default router;
