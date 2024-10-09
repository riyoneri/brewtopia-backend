import { Router } from "express";

import adminAuthRoute from "./admin-auth.route";
import userAuthRoute from "./user-auth.route";

const router = Router();

router.use("/admin/auth", adminAuthRoute);
router.use("/auth", userAuthRoute);

export default router;
