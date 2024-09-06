import { Router } from "express";

import adminAuthRoute from "./admin-auth.route";

const router = Router();

router.use("/admin/auth", adminAuthRoute);

export default router;
