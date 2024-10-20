import { Router } from "express";
import { body, param } from "express-validator";

import { adminController } from "../controllers";
import adminAuthMiddleware from "../middlewares/admin-auth.middleware";

const router = Router();

router.use(adminAuthMiddleware);
router.get("/clients", adminController.listCustomers);
router.post(
  "/clients/:userId/status",
  [
    param("userId", "Enter a valid user id")
      .isString()
      .notEmpty({ ignore_whitespace: true })
      .isMongoId(),
    body("active", "Active property must be a boolean").isBoolean({
      strict: true,
    }),
  ],
  adminController.changeClientStatus,
);

export default router;
