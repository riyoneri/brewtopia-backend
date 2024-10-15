import { Router } from "express";

import { adminController } from "../controllers";

const router = Router();

router.get("/clients", adminController.listCustomers);

export default router;
