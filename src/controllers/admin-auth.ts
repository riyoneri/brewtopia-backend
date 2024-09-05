import { NextFunction, Request, Response } from "express";

import getCustomValidationResults from "../helpers/get-validation-results";
import CustomError from "../utils/custom-error";

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

    response.status(401).json({ message: "Reached here" });
  } catch {
    const error = new CustomError("Internal serverError.");
    next(error);
  }
};
