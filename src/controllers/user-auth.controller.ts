import { compare, hash } from "bcrypt";
import dayjs from "dayjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { environment } from "../config";
import {
  InvalidCredentialsMessage,
  ServerErrorMessage,
  ValidationErrorMessage,
  getNotFoundMessage,
} from "../constants";
import getUserResetPasswordEmail from "../helpers/emails/user-reset-password";
import getUserVerificationEmail from "../helpers/emails/user-verification-email";
import {
  getResetPasswordUniqueId,
  getVerifyEmailUniqueId,
} from "../helpers/generate-unique-id";
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

    const token = jwt.sign({ id: user?.id }, environment.jwtSecret, {
      expiresIn: "1h",
    });

    if (user) return response.status(200).json({ user: user.toJSON(), token });

    const newUserData = new User({
      name: request.body.name,
      email: {
        value: request.body.email,
        verified: true,
      },
      imageUrl: request.body.picture,
    });

    const savedUser = await newUserData.save();

    response.status(201).json({ user: savedUser.toJSON(), token });
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

    const user = await User.findOne({ "email.value": request.body.email });

    if (!user) {
      const error = new CustomError(getNotFoundMessage("User"), 404);
      return next(error);
    }

    if (!user.password) {
      const error = new CustomError(
        "Password reset is not available for accounts authenticated via Google",
        403,
      );

      return next(error);
    }

    const resetPasswordId = getResetPasswordUniqueId();

    user.authTokens.resetPassword = {
      expirationDate: dayjs().add(15, "minutes").toISOString(),
      value: resetPasswordId,
    };

    await user.save();

    let userFirstname = "";

    try {
      userFirstname = user.name.split(" ")[0];
    } catch {
      userFirstname = user.name;
    }

    await resend.emails.send({
      from: "BrewTopia <onboarding@resend.dev>",
      to: [user.email.value],
      subject: "Password Reset Request",
      html: getUserResetPasswordEmail(
        userFirstname,
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

export const resetPassword = async (
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
        { "authTokens.resetPassword.value": request.body.token },
        {
          "authTokens.resetPassword.expirationDate": { $gt: dayjs().toJSON() },
        },
      ],
    });

    if (!user || !user.password) {
      const error = new CustomError("Invalid or expired reset token", 403);
      return next(error);
    }

    const isSamePassword = await compare(request.body.password, user.password);

    if (isSamePassword) {
      const error = new CustomError(
        "New password cannot be the same as the previous password.",
        400,
      );

      return next(error);
    }

    user.authTokens.resetPassword = undefined;
    user.password = await hash(request.body.password, 12);

    await user.save();

    return response
      .status(200)
      .json({ message: "Password is updated successfully" });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};

export const login = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const validationErrors = getCustomValidationResults(request);

    if (validationErrors) {
      const error = new CustomError(
        "Email and Password must be available in body",
        400,
        validationErrors,
      );

      return next(error);
    }

    const user = await User.findOne({ "email.value": request.body.email });

    if (!user) {
      const error = new CustomError(InvalidCredentialsMessage, 401);

      return next(error);
    }

    if (!user.email.verified) {
      const error = new CustomError("Email address is not yet verified", 403);

      return next(error);
    }

    if (!user.password) {
      const error = new CustomError(
        "Provided email uses google to authenticate",
        403,
      );

      return next(error);
    }

    const passwordsMatch = await compare(request.body.password, user.password);

    if (!passwordsMatch) {
      const error = new CustomError(InvalidCredentialsMessage, 401);

      return next(error);
    }

    const token = jwt.sign({ id: user.id }, environment.jwtSecret, {
      expiresIn: "1h",
    });

    response.status(200).json({ user: user.toJSON(), token });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};
