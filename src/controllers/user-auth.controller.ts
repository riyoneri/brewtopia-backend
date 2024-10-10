import { NextFunction, Request, Response } from "express";

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
