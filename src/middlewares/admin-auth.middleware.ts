import { NextFunction, Request, Response } from "express";

import { InvalidAuthUserMessage, ServerErrorMessage } from "../constants";
import { Admin } from "../models";
import CustomError from "../utils/custom-error";

const adminAuthMiddleware = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  try {
    if (request.auth?.role !== "admin") {
      const error = new CustomError(InvalidAuthUserMessage);
      return next(error);
    }

    const admin = await Admin.findOne({ _id: request.auth?.id });

    if (!admin) {
      const error = new CustomError(InvalidAuthUserMessage);
      return next(error);
    }

    request.admin = admin;

    return next();
  } catch {
    const error = new CustomError(ServerErrorMessage, 500);
    next(error);
  }
};

export default adminAuthMiddleware;
