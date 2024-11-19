import { NextFunction, Request, Response } from "express";

import { ServerErrorMessage, ValidationErrorMessage } from "../../constants";
import { getValidationResult } from "../../helpers";
import CustomError from "../../utils/custom-error";

export const createPromotion = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const validationErrors = getValidationResult(request);

    if (validationErrors) {
      const error = new CustomError(
        ValidationErrorMessage,
        400,
        validationErrors,
      );
      return next(error);
    }

    return response.status(400).json({ message: "Lion" });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};
