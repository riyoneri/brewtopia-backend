import { Router } from "express";
import { body, header } from "express-validator";

import { userAuthController } from "../controllers";

const router = Router();

router.post(
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
  userAuthController.authWithGoogle,
);

export default router;