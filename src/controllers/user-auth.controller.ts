import { hash } from "bcrypt";
import { NextFunction, Request, Response } from "express";

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
      const error = new CustomError("Validation error", 400, validationErrors);
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
    const error = new CustomError("Internal serverError.");
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
      const error = new CustomError("Validation error", 400, validationErrors);
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

    response.status(201).json({ message: "User created successfully." });
  } catch {
    const error = new CustomError("Internal serverError.");
    next(error);
  }
};
