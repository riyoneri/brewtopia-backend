import { NextFunction, Request, Response } from "express";

import { ServerErrorMessage, ValidationErrorMessage } from "../../constants";
import { normalizeCategory } from "../../helpers";
import getCustomValidationResults from "../../helpers/get-validation-results";
import { Category } from "../../models";
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

    const newCategoryData = new Category({
      name: request.body.name,
      name_lower: normalizeCategory(request.body.name),
    });

    const savedCategory = await newCategoryData.save();

    response.status(201).json(savedCategory.toObject());
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};
