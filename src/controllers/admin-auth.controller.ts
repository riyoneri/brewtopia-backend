import { hash } from "bcrypt";
import dayjs from "dayjs";
import { NextFunction, Request, Response } from "express";

import {
  ServerErrorMessage,
  ValidationErrorMessage,
  getNotFoundMessage,
} from "../constants/response-messages";
import getAdminResetPasswordEmail from "../helpers/emails/admin-reset-password";
import getAdminVerificationEmail from "../helpers/emails/admin-verification-email";
import {
  getResetPasswordUniqueId,
  getVerifyEmailUniqueId,
} from "../helpers/generate-unique-id";
import resend from "../helpers/get-resend";
import getCustomValidationResults from "../helpers/get-validation-results";
import { Admin } from "../models";
import CustomError from "../utils/custom-error";

export const authWithGoogle = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const validationErrors = getCustomValidationResults(request);

    if (validationErrors) {
      const error = new CustomError(
        ValidationErrorMessage,
        400,
        validationErrors,
      );
      return next(error);
    }

    const admin = await Admin.findOne({ "email.value": request.body.email });

    if (admin) return response.status(200).json(admin.toJSON());

    const newAdminData = new Admin({
      name: request.body.name,
      email: {
        value: request.body.email,
        verified: true,
      },
      imageUrl: request.body.picture,
    });

    const savedAdmin = await newAdminData.save();

    response.status(201).json(savedAdmin.toJSON());
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};

export const createAdmin = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const validationErrors = getCustomValidationResults(request);

    if (validationErrors) {
      const error = new CustomError(
        ValidationErrorMessage,
        400,
        validationErrors,
      );
      return next(error);
    }

    const hashedPassword = await hash(request.body.password, 12);

    const emailUniqueId = getVerifyEmailUniqueId();

    const newAdminData = new Admin({
      name: request.body.name,
      email: { value: request.body.email },
      password: hashedPassword,
      authTokens: {
        emailVerification: emailUniqueId,
      },
    });

    const savedAdmin = await newAdminData.save();

    await resend.emails.send({
      from: "BrewTopia Admin <onboarding@resend.dev>",
      to: [request.body.email],
      subject: "Verify Admin",
      html: getAdminVerificationEmail(
        `${request.body.redirectUrl}?token=${emailUniqueId}`,
      ),
    });

    response.status(201).json(savedAdmin.toJSON());
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};

export const resendVerificationEmail = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const validationErrors = getCustomValidationResults(request);

    if (validationErrors) {
      const error = new CustomError(
        ValidationErrorMessage,
        400,
        validationErrors,
      );
      return next(error);
    }

    const admin = await Admin.findOne({ "email.value": request.body.email });

    if (!admin) {
      const error = new CustomError(getNotFoundMessage("User"), 404);

      return next(error);
    }

    if (admin.email.verified) {
      const error = new CustomError("Email is already verified", 401);

      return next(error);
    }

    const emailUniqueId = getVerifyEmailUniqueId();

    admin.authTokens.emailVerification = emailUniqueId;

    await admin.save();

    await resend.emails.send({
      from: "BrewTopia <onboarding@resend.dev>",
      to: [request.body.email],
      subject: "Verify Admin",
      html: getAdminVerificationEmail(
        `${request.body.redirectUrl}?token=${emailUniqueId}`,
      ),
    });

    response.status(201).json({ message: "Verification email is resent" });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};

export const verifyEmail = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const validationErrors = getCustomValidationResults(request);

    if (validationErrors) {
      const error = new CustomError(
        ValidationErrorMessage,
        400,
        validationErrors,
      );
      return next(error);
    }

    const admin = await Admin.findOne({
      $and: [
        {
          "authTokens.emailVerification": request.body.token,
        },
        {
          "email.verified": false,
        },
      ],
    });

    if (!admin) {
      const error = new CustomError(getNotFoundMessage("User"), 404);

      return next(error);
    }

    admin.authTokens.emailVerification = undefined;
    admin.email.verified = true;

    await admin.save();

    response
      .status(200)
      .json({ message: "Email has been verified successfully" });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};

export const forgotPassword = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const validationErrors = getCustomValidationResults(request);

    if (validationErrors) {
      const error = new CustomError(
        ValidationErrorMessage,
        400,
        validationErrors,
      );
      return next(error);
    }

    const admin = await Admin.findOne({ "email.value": request.body.email });

    if (!admin) {
      const error = new CustomError(getNotFoundMessage("User"), 404);
      return next(error);
    }

    if (!admin.password) {
      const error = new CustomError(
        "Password reset is not available for accounts authenticated via Google",
        403,
      );

      return next(error);
    }

    const resetPasswordId = getResetPasswordUniqueId();

    admin.authTokens.resetPassword = {
      expirationDate: dayjs().add(15, "minutes").toISOString(),
      value: resetPasswordId,
    };

    await admin.save();

    let adminFirstname = "";

    try {
      adminFirstname = admin.name.split(" ")[0];
    } catch {
      adminFirstname = admin.name;
    }

    await resend.emails.send({
      from: "BrewTopia <onboarding@resend.dev>",
      to: [admin.email.value],
      subject: "Admin Password Reset Request",
      html: getAdminResetPasswordEmail(
        adminFirstname,
        `${request.body.redirectUrl}?token=${resetPasswordId}`,
      ),
    });

    return response
      .status(200)
      .json({ message: "Reset password instructions are sent." });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};
