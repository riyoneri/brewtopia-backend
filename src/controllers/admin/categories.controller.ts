import { NextFunction, Request, Response } from "express";

import {
  ServerErrorMessage,
  ValidationErrorMessage,
  getNotFoundMessage,
} from "../../constants";
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
    const page = Number(request.query.page);
    const limit = Number(request.query.limit);
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

export const getSingleCategory = async (
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

    const category = await Category.findOne({ _id: request.params.categoryId });

    if (!category)
      return response
        .status(404)
        .json({ message: getNotFoundMessage("Category") });

    response.status(200).json(category.toObject());
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};

export const updateCategory = async (
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

    const updatedCategory = await Category.findByIdAndUpdate(
      request.params.categoryId,
      { name: request.body.name },
      { new: true },
    );

    if (!updatedCategory)
      return response
        .status(404)
        .json({ message: getNotFoundMessage("Category") });

    response.status(200).json(updatedCategory.toObject());
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};

export const deleteCategory = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const validationErrors = getValidationResult(request);

    if (validationErrors) {
      const error = new CustomError("Category id is invalid", 400);
      return next(error);
    }

    await Category.findByIdAndDelete(request.params.categoryId);

    response.status(200).json({ message: "Category was deleted" });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};
