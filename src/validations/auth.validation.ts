import { body, header } from "express-validator";
import { Model } from "mongoose";

import { environment } from "../config";

export const authWithGoogleChain = () => [
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
        return environment.callbackToken === callbackToken;
      } catch {
        return false;
      }
    })
    .withMessage("Callback token is invalid"),
];

export const registerChain = <T>(model: Model<T>) => [
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
      model.findOne({ "email.value": value }).then((user) => {
        if (user) throw "Email already exists";
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
      require_tld: environment.nodeEnv === "production",
    })
    .withMessage("Redirect url must be a valid url"),
];

export const resendVerificationEmailChain = () => [
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
      require_tld: environment.nodeEnv === "production",
    })
    .withMessage("Redirect url must be a valid url"),
];

export const verifyEmailChain = () => [
  body("token", "Token is required")
    .isString()
    .notEmpty({ ignore_whitespace: true })
    .trim(),
];

export const forgotPasswordChain = () => [
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
      require_tld: environment.nodeEnv === "production",
    })
    .withMessage("Redirect url must be a valid url"),
];
