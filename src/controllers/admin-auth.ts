import { NextFunction, Request, Response } from "express";

import CustomError from "../utils/custom-error";

export const createAdmin = async (
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    response.status(200).json({ message: "Reached here" });
  } catch {
    const error = new CustomError("Internal serverError.");
    next(error);
  }
};
