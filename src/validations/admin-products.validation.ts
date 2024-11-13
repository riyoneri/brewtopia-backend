import { body, param } from "express-validator";

export const createProductChain = () => [
  body("name", "Name is required")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true }),
  body("price", "Price is required")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true })
    .isNumeric({ no_symbols: true })
    .withMessage("Price must not have any symbols")
    .bail()
    .custom((value) => {
      if (value > 500) throw "Price must be less than 500";
      return true;
    }),
  body("description", "Description is required")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true }),
  body("image", "Image is required")
    .notEmpty({ ignore_whitespace: true })
    .custom((_value, { req }) => {
      if (req.body.fileError) throw req.body.fileError;
      return true;
    }),
  body("category", "Category is required")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true })
    .isMongoId()
    .withMessage("Category ID must be valid."),
];

export const getSingleProductChain = () =>
  param("productId", "Invalid product id")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true })
    .isMongoId();

export const updateProductChain = () => [
  param("productId", "Invalid product id")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true })
    .isMongoId(),
  body("name", "Name is required")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true }),
  body("price", "Price is required")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true })
    .isNumeric({ no_symbols: true })
    .withMessage("Price must not have any symbols")
    .bail()
    .custom((value) => {
      if (value > 500) throw "Price must be less than 500";
      return true;
    }),
  body("description", "Description is required")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true }),
  body("image", "Image is required")
    .notEmpty({ ignore_whitespace: true })
    .custom((_value, { req }) => {
      if (req.body.fileError) throw req.body.fileError;
      return true;
    }),
  body("category", "Category is required")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true })
    .isMongoId()
    .withMessage("Category ID must be valid."),
];

export const deleteProductChain = () =>
  param("productId", "Product id is invalid")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true })
    .isMongoId();
