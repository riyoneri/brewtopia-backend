import { NextFunction, Request, Response } from "express";

import { ServerErrorMessage, ValidationErrorMessage } from "../../constants";
import getCustomValidationResults from "../../helpers/get-validation-results";
import CustomError from "../../utils/custom-error";

export const createCategory = async (
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

    response.status(400).json({ message: "😭💔💀" });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};
