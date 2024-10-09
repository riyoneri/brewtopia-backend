import { Router } from "express";

import adminAuthRoute from "./admin-auth.route";
import userAuthRouter from "./user-auth.router";

const router = Router();

router.use("/admin/auth", adminAuthRoute);
router.use("/auth", userAuthRouter);

export default router;
