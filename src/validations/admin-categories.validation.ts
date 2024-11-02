import { body } from "express-validator";

import { Category } from "../models";

export const createCategoryChain = () =>
  body("name", "Name is required")
    .isString()
    .trim()
    .notEmpty({ ignore_whitespace: true })
    .bail()
    .custom((value) =>
      Category.findOne({ name: value }).then((category) => {
        if (category) throw "Category already exist";
      }),
    );
