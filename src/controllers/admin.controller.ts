import { NextFunction, Request, Response } from "express";

import { ServerErrorMessage } from "../constants";
import { User } from "../models";
import CustomError from "../utils/custom-error";

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
          ...document.toJSON(),
          active: document.active,
        })),
      );

    response.status(200).json({ users: users, total: totalUsers });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};
