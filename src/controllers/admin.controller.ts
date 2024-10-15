import { NextFunction, Request, Response } from "express";

import { ServerErrorMessage } from "../constants";
import CustomError from "../utils/custom-error";

export const listCustomers = async (
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    response.status(200).json({ message: "You reached here" });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};
