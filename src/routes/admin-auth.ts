import express from "express";

import { adminAuthController } from "../controllers";

const router = express.Router();

router.post("/register", adminAuthController.createAdmin);

export default router;
