import { Router } from "express";

import adminAuthRoutes from "./admin-auth.routes";
import adminRoutes from "./admin.routes";
import userAuthRoutes from "./user-auth.routes";

const router = Router();

router.use("/admin/auth", adminAuthRoutes);
router.use("/admin", adminRoutes);
router.use("/auth", userAuthRoutes);

export default router;
