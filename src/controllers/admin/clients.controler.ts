import { NextFunction, Request, Response } from "express";

import {
  ServerErrorMessage,
  ValidationErrorMessage,
  getNotFoundMessage,
} from "../../constants";
import getCustomValidationResults from "../../helpers/get-validation-results";
import { User } from "../../models";
import { clientSocket } from "../../sockets";
import CustomError from "../../utils/custom-error";

export const listCustomers = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();

    const users = await User.find({}, undefined, {})
      .skip(skip)
      .limit(limit)
      .transform((documents) =>
        documents.map((document) => ({
          ...document.toObject(),
          active: document.active,
        })),
      );

    response.status(200).json({ users: users, total: totalUsers });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};

export const changeClientStatus = async (
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

    const user = await User.findOne({ _id: request.params.userId });

    if (!user) {
      const error = new CustomError(getNotFoundMessage("User"), 404);

      return next(error);
    }

    if (user.active === request.body.active)
      return response
        .status(200)
        .json({ message: "User status was updates successfully" });

    user.active = request.body.active;

    await user.save();

    clientSocket.changeStatus(user.id, request.body.active);

    response
      .status(200)
      .json({ message: "User status was updates successfully" });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};
