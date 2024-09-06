import { NextFunction, Request, Response } from "express";

import getCustomValidationResults from "../helpers/get-validation-results";
import { Admin } from "../models";
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

    const admin = await Admin.findOne({ "email.value": request.body.email });

    if (admin) return response.status(200).json(admin.toJSON());

    const newAdminData = new Admin({
      name: request.body.name,
      email: {
        value: request.body.email,
        verified: true,
      },
      imageUrl: request.body.image,
    });

    const savedAdmin = await newAdminData.save();

    response.status(201).json(savedAdmin.toJSON());
  } catch {
    const error = new CustomError("Internal serverError.");
    next(error);
  }
};

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
