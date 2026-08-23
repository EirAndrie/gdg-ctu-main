import { Router } from "express";
import adminRoutes from "./admins/admin.routes";
import eventHostRoutes from "./event-hosts/event-hosts.routes";
import eventAttendeeRoutes from "./event-attendees/event-attendees.routes";
import eventRoutes from "./events/event.routes";
import mediaCollectionRoutes from "./media-collections/media-collections.routes";
import mediaCollectionItemRoutes from "./media-collection-items/media-collection-items.routes";
import mediaRoutes from "./media/media.routes";
import siteContentRoutes from "./site-content/site-content.routes";
import teamMemberRoutes from "./team-members/team-member.routes";
import eventSpeakerRoutes from "./event-speakers/event-speaker.routes";

const router = Router();

router.use("/admins", adminRoutes);
router.use("/team-members", teamMemberRoutes);
router.use("/events", eventRoutes);
router.use("/media", mediaRoutes);
router.use("/site-content", siteContentRoutes);
router.use("/event-speakers", eventSpeakerRoutes);
router.use("/event-hosts", eventHostRoutes);
router.use("/event-attendees", eventAttendeeRoutes);
router.use("/media-collections", mediaCollectionRoutes);
router.use("/media-collection-items", mediaCollectionItemRoutes);

export default router;
