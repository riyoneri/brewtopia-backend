import { Router } from "express";
import { body, param } from "express-validator";

import { categoriesController, clientsController } from "../controllers";
import adminAuthMiddleware from "../middlewares/admin-auth.middleware";
import { createCategoryChain } from "../validations";

const router = Router();

router
  .use(adminAuthMiddleware)
  .get("/clients", clientsController.listCustomers)
  .patch(
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
    clientsController.changeClientStatus,
  );

router.post(
  "/categories",
  createCategoryChain(),
  categoriesController.createCategory,
);

export default router;
