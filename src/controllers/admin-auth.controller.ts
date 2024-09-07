import { hash } from "bcrypt";
import { NextFunction, Request, Response } from "express";

import getVerificationEmail from "../helpers/emails/verification-email";
import { getVerifyEmailUniqueId } from "../helpers/generate-unique-id";
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
      const error = new CustomError("Validation error", 400, validationErrors);
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
      imageUrl: request.body.image,
    });

    const savedAdmin = await newAdminData.save();

    response.status(201).json(savedAdmin.toJSON());
  } catch {
    const error = new CustomError("Internal serverError.");
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
      const error = new CustomError("Validation error", 400, validationErrors);
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
      from: "BrewTopia <onboarding@resend.dev>",
      to: [request.body.email],
      subject: "Welcome to BrewTopia",
      html: getVerificationEmail(
        `${request.body.redirectUrl}?token=${emailUniqueId}`,
      ),
    });

    response.status(201).json(savedAdmin.toJSON());
  } catch {
    const error = new CustomError("Internal serverError.");
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
      const error = new CustomError("Validation error", 400, validationErrors);
      return next(error);
    }

    const admin = await Admin.findOne({ "email.value": request.body.email });

    if (!admin) {
      const error = new CustomError("User not found", 404);

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
      subject: "Welcome to BrewTopia",
      html: getVerificationEmail(
        `${request.body.redirectUrl}?token=${emailUniqueId}`,
      ),
    });

    response.status(201).json({ message: "Verification email is resent" });
  } catch {
    const error = new CustomError("Internal serverError.");
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
      const error = new CustomError("Validation error", 400, validationErrors);
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
      const error = new CustomError("User not found", 404);

      return next(error);
    }

    admin.authTokens.emailVerification = undefined;
    admin.email.verified = true;

    await admin.save();

    response
      .status(200)
      .json({ message: "Email has been verified successfully" });
  } catch {
    const error = new CustomError("Internal serverError.");
    next(error);
  }
};
