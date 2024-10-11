import { hash } from "bcrypt";
import { NextFunction, Request, Response } from "express";

import {
  ServerErrorMessage,
  ValidationErrorMessage,
  getNotFoundMessage,
} from "../constants/response-messages";
import getUserVerificationEmail from "../helpers/emails/user-verification-email";
import { getVerifyEmailUniqueId } from "../helpers/generate-unique-id";
import resend from "../helpers/get-resend";
import getCustomValidationResults from "../helpers/get-validation-results";
import { User } from "../models";
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

    const user = await User.findOne({ "email.value": request.body.email });

    if (user) return response.status(200).json(user.toJSON());

    const newUserData = new User({
      name: request.body.name,
      email: {
        value: request.body.email,
        verified: true,
      },
      imageUrl: request.body.picture,
    });

    const savedUser = await newUserData.save();

    response.status(201).json(savedUser.toJSON());
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};

export const createUser = async (
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

    const newUserData = new User({
      name: request.body.name,
      email: { value: request.body.email },
      password: hashedPassword,
      authTokens: {
        emailVerification: emailUniqueId,
      },
    });

    const savedUser = await newUserData.save();

    await resend.emails.send({
      from: "BrewTopia <onboarding@resend.dev>",
      to: [savedUser.email.value],
      subject: "Verify Your Email",
      html: getUserVerificationEmail(
        `${request.body.redirectUrl}?token=${emailUniqueId}`,
      ),
    });

    response.status(201).json({ message: "User created successfully" });
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

    const user = await User.findOne({ "email.value": request.body.email });

    if (!user) {
      const error = new CustomError(getNotFoundMessage("User"), 404);

      return next(error);
    }

    if (user.email.verified) {
      const error = new CustomError("Email is already verified", 403);

      return next(error);
    }

    const emailUniqueId = getVerifyEmailUniqueId();

    user.authTokens.emailVerification = emailUniqueId;

    await user.save();

    await resend.emails.send({
      from: "BrewTopia <onboarding@resend.dev>",
      to: [user.email.value],
      subject: "Verify Your Email",
      html: getUserVerificationEmail(
        `${request.body.redirectUrl}?token=${emailUniqueId}`,
      ),
    });

    response.status(209).json({ message: "Verification email is resent" });
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

    const user = await User.findOne({
      $and: [
        {
          "authTokens.emailVerification": request.body.token,
        },
        {
          "email.verified": false,
        },
      ],
    });

    if (!user) {
      const error = new CustomError(getNotFoundMessage("User"), 404);

      return next(error);
    }

    user.authTokens.emailVerification = undefined;
    user.email.verified = true;

    await user.save();

    response
      .status(200)
      .json({ message: "Email has been verified successfully" });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};
