import express from "express";
import { body } from "express-validator";

import { adminAuthController } from "../controllers";
import { Admin } from "../models";

const router = express.Router();

router.post(
  "/register",
  [
    body("name", "Name is required")
      .isString()
      .notEmpty({ ignore_whitespace: true })
      .trim(),
    body("email", "Email is required")
      .isString()
      .notEmpty({ ignore_whitespace: true })
      .isEmail()
      .withMessage("Email must be valid")
      .trim()
      .normalizeEmail({ all_lowercase: true })
      .bail()
      .custom((value) =>
        Admin.findOne({ "email.value": value }).then((admin) => {
          if (admin) throw "Email already exists";
        }),
      ),
    body("password", "Password is required")
      .isString()
      .notEmpty({ ignore_whitespace: true })
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
      })
      .withMessage("Password is not strong enough"),
    body("confirmPassword", "Confirm password is required")
      .custom((value, { req }) => req.body.password === value)
      .withMessage("Passwords must match"),
  ],
  adminAuthController.createAdmin,
);

export default router;
