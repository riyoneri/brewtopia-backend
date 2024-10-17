import { NextFunction, Request, Response } from "express";

import { InvalidAuthUserMessage, ServerErrorMessage } from "../constants";
import { User } from "../models";
import CustomError from "../utils/custom-error";

const authMiddleware = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  try {
    if (request.auth?.role !== "user") {
      const error = new CustomError(InvalidAuthUserMessage);
      return next(error);
    }

    const user = await User.findOne({ _id: request.auth?.id });

    if (!user) {
      const error = new CustomError(InvalidAuthUserMessage);
      return next(error);
    }

    request.user = user;

    next();
  } catch {
    const error = new CustomError(ServerErrorMessage, 500);
    next(error);
  }
};

export default authMiddleware;
