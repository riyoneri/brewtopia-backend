import express from "express";
import { body, header } from "express-validator";

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
      body("email", "Email must be valid google mail")
        .isString()
        .notEmpty({ ignore_whitespace: true })
        .isEmail({ host_whitelist: ["gmail.com"] })
        .trim()
        .normalizeEmail({ all_lowercase: true }),
      body("picture", "Image must be valid google image url")
        .isString()
        .optional({ values: "undefined" })
        .isURL({ host_whitelist: ["lh3.googleusercontent.com"] })
        .notEmpty({ ignore_whitespace: true })
        .trim(),
      header("authorization", "Callback token is required")
        .isString()
        .notEmpty({ ignore_whitespace: true })
        .bail()
        .custom((value) => {
          try {
            const callbackToken = value.split(" ")[1];
            return process.env.CALLBACK_TOKEN === callbackToken;
          } catch {
            return false;
          }
        })
        .withMessage("Callback token is invalid"),
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
        .isURL({
          require_protocol: true,
          allow_query_components: false,
          require_tld: process.env.NODE_ENV === "production",
        })
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
        .isURL({
          require_protocol: true,
          allow_query_components: false,
          require_tld: process.env.NODE_ENV === "production",
        })
        .withMessage("Redirect url must be a valid url"),
    ],
    adminAuthController.resendVerificationEmail,
  )
  .post(
    "/verify-email",
    [
      body("token", "Token is required")
        .isString()
        .notEmpty({ ignore_whitespace: true })
        .trim(),
    ],
    adminAuthController.verifyEmail,
  )
  .post(
    "/forgot-password",
    [
      body("email", "Email is required")
        .isString()
        .notEmpty({ ignore_whitespace: true })
        .isEmail()
        .withMessage("Email must be valid")
        .trim()
        .normalizeEmail({ all_lowercase: true }),
      body("redirectUrl", "Redirect url is required")
        .isString()
        .notEmpty({ ignore_whitespace: true })
        .isURL({
          require_protocol: true,
          allow_query_components: false,
          require_tld: process.env.NODE_ENV === "production",
        })
        .withMessage("Redirect url must be a valid url"),
    ],
    adminAuthController.forgotPassword,
  )
  .post(
    "/reset-password",
    [
      body("token", "Token is required")
        .isString()
        .notEmpty({ ignore_whitespace: true })
        .trim(),
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
    adminAuthController.resetPassword,
  )
  .post(
    "/login",
    [
      body(
        ["email", "password"],
        "Email and Password must be available in body",
      )
        .isString()
        .notEmpty({ ignore_whitespace: true }),
      body("email")
        .isString()
        .isEmail()
        .trim()
        .normalizeEmail({ all_lowercase: true }),
    ],
    adminAuthController.login,
  );

export default router;
