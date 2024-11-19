import { Router } from "express";
import { body, param } from "express-validator";

import {
  categoriesController,
  clientsController,
  productsController,
  promotionController,
} from "../controllers";
import {
  adminAuthMiddleware,
  productFileUploadMiddleware,
} from "../middlewares";
import {
  createCategoryChain,
  createProductChain,
  createPromotion,
  deleteCategoryChain,
  deleteProductChain,
  getAllSanitizer,
  getSingleCategoryChain,
  getSingleProductChain,
  updateCategoryChain,
  updateProductChain,
} from "../validations";

const router = Router();

router
  .use(adminAuthMiddleware)
  .get("/clients", getAllSanitizer(), clientsController.getAllClients)
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
  )
  .patch(
    "/categories/:categoryId",
    updateCategoryChain(),
    categoriesController.updateCategory,
  )
  .delete(
    "/categories/:categoryId",
    deleteCategoryChain(),
    categoriesController.deleteCategory,
  );

router
  .post(
    "/products",
    productFileUploadMiddleware,
    createProductChain(),
    productsController.createProduct,
  )
  .get("/products", getAllSanitizer(), productsController.getAllProducts)
  .get(
    "/products/:productId",
    getSingleProductChain(),
    productsController.getSingleProduct,
  )
  .patch(
    "/products/:productId",
    productFileUploadMiddleware,
    updateProductChain(),
    productsController.updateProduct,
  )
  .delete(
    "/products/:productId",
    deleteProductChain(),
    productsController.deleteProduct,
  );

router.post(
  "/promotions",
  createPromotion(),
  promotionController.createPromotion,
);

export default router;
