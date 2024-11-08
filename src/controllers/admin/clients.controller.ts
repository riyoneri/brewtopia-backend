import { NextFunction, Request, Response } from "express";

import {
  ServerErrorMessage,
  ValidationErrorMessage,
  getNotFoundMessage,
} from "../../constants";
import { getValidationResult } from "../../helpers";
import { User } from "../../models";
import { clientSocket } from "../../sockets";
import CustomError from "../../utils/custom-error";

export const getAllClients = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(request.query.page) || undefined;
    const limit = Number(request.query.limit || undefined);
    const skip = page && limit ? (page - 1) * limit : undefined;

    const totalUsers = await User.countDocuments();

    const users = await User.find({}, {}, { skip, limit }).transform(
      (documents) =>
        documents.map((document) => ({
          ...document.toObject(),
          active: document.active,
        })),
    );

    response.status(200).json({ users, total: totalUsers });
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
    const validationErrors = getValidationResult(request);

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
