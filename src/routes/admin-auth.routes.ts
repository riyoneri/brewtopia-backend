import express from "express";

import { adminAuthController } from "../controllers";
import { Admin } from "../models";
import {
  authWithGoogleChain,
  forgotPasswordChain,
  loginChain,
  registerChain,
  resendVerificationEmailChain,
  resetPasswordChain,
  verifyEmailChain,
} from "../validations";

const router = express.Router();

router
  .post("/google", authWithGoogleChain(), adminAuthController.authWithGoogle)
  .post("/register", registerChain(Admin), adminAuthController.createAdmin)
  .post(
    "/resend-verification-email",
    resendVerificationEmailChain(),
    adminAuthController.resendVerificationEmail,
  )
  .post("/verify-email", verifyEmailChain(), adminAuthController.verifyEmail)
  .post(
    "/forgot-password",
    forgotPasswordChain(),
    adminAuthController.forgotPassword,
  )
  .post(
    "/reset-password",
    resetPasswordChain(),
    adminAuthController.resetPassword,
  )
  .post("/login", loginChain(), adminAuthController.login);

export default router;
