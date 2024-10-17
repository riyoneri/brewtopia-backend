import { Router } from "express";

import { adminController } from "../controllers";
import adminAuthMiddleware from "../middlewares/admin-auth.middleware";

const router = Router();

router.use(adminAuthMiddleware);
router.get("/clients", adminController.listCustomers);

export default router;
