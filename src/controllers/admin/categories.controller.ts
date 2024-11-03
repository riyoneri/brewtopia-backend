import { NextFunction, Request, Response } from "express";

import { ServerErrorMessage, ValidationErrorMessage } from "../../constants";
import { getValidationResult, normalizeCategory } from "../../helpers";
import { Category } from "../../models";
import CustomError from "../../utils/custom-error";

export const createCategory = async (
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

export const getAllCategories = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCategories = await Category.countDocuments();

    const categories = await Category.find()
      .skip(skip)
      .limit(limit)
      .transform((document) => document.map((document) => document.toObject()));

    response.status(200).json({ categories, total: totalCategories });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};
