import { Router } from "express";

import { userAuthController } from "../controllers";
import { User } from "../models";
import {
  authWithGoogleChain,
  forgotPasswordChain,
  loginChain,
  registerChain,
  resendVerificationEmailChain,
  resetPasswordChain,
  verifyEmailChain,
} from "../validations";

const router = Router();

router
  .post("/google", authWithGoogleChain(), userAuthController.authWithGoogle)
  .post("/register", registerChain(User), userAuthController.createUser)
  .post(
    "/resend-verification-email",
    resendVerificationEmailChain(),
    userAuthController.resendVerificationEmail,
  )
  .post("/verify-email", verifyEmailChain(), userAuthController.verifyEmail)
  .post(
    "/forgot-password",
    forgotPasswordChain(),
    userAuthController.forgotPassword,
  )
  .post(
    "/reset-password",
    resetPasswordChain(),
    userAuthController.resetPassword,
  )
  .post("/login", loginChain(), userAuthController.login);

export default router;
