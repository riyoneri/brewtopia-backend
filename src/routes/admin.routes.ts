import { Router } from "express";
import { body, param } from "express-validator";

import { categoriesController, clientsController } from "../controllers";
import adminAuthMiddleware from "../middlewares/admin-auth.middleware";
import {
  createCategoryChain,
  getAllSanitizer,
  getSingleCategoryChain,
} from "../validations";

const router = Router();

router
  .use(adminAuthMiddleware)
  .get("/clients", getAllSanitizer(), clientsController.listCustomers)
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

router
  .post(
    "/categories",
    createCategoryChain(),
    categoriesController.createCategory,
  )
  .get("/categories", getAllSanitizer(), categoriesController.getAllCategories)
  .get(
    "/categories/:categoryId",
    getSingleCategoryChain(),
    categoriesController.getSingleCategory,
  );

export default router;
