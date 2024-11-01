import { body } from "express-validator";

export const createCategoryChain = () =>
  body("name", "Name is required")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true });
