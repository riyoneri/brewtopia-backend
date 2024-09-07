import express from "express";
import { body } from "express-validator";

import { adminAuthController } from "../controllers";
import { Admin } from "../models";

const router = express.Router();

router
  .post(
    "/google",
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
        .normalizeEmail({ all_lowercase: true }),
      body("image", "Image must be valid url")
        .optional({ values: "undefined" })
        .isString()
        .notEmpty({ ignore_whitespace: true })
        .trim(),
    ],
    adminAuthController.authWithGoogle,
  )
  .post(
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
      body("redirectUrl", "Redirect url is required")
        .isString()
        .notEmpty({ ignore_whitespace: true })
        .isURL({ require_protocol: true, allow_query_components: false })
        .withMessage("Redirect url must be a valid url"),
    ],
    adminAuthController.createAdmin,
  )
  .post(
    "/resend-verification-email",
    [
      body("email", "Email is required")
        .isString()
        .notEmpty({ ignore_whitespace: true })
        .isEmail()
        .withMessage("Email must be valid")
        .trim()
        .normalizeEmail({ all_lowercase: true })
        .bail(),
      body("redirectUrl", "Redirect url is required")
        .isString()
        .notEmpty({ ignore_whitespace: true })
        .isURL({ require_protocol: true, allow_query_components: false })
        .withMessage("Redirect url must be a valid url"),
    ],
    adminAuthController.resendVerificationEmail,
  );

export default router;
