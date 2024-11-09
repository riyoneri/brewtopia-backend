import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";

import { environment } from "../../config";
import {
  ServerErrorMessage,
  ValidationErrorMessage,
  getNotFoundMessage,
} from "../../constants";
import { getValidationResult } from "../../helpers";
import getS3Client from "../../helpers/get-s3client";
import { Category } from "../../models";
import CustomError from "../../utils/custom-error";

export const createProduct = async (
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

    const selectedCategory = await Category.findById(request.body.category);

    if (!selectedCategory) {
      const error = new CustomError(ValidationErrorMessage, 400, {
        category: getNotFoundMessage("Category"),
      });

      return next(error);
    }

    const resizedImage = await sharp(request.body.image)
      .resize(1000, undefined, { withoutEnlargement: true })
      .toBuffer();

    const s3 = getS3Client();

    await s3.send(
      new PutObjectCommand({
        Bucket: environment.awsBucketName,
        Body: resizedImage,
        Key: "lion",
      }),
    );

    response.status(400).json({ message: "Not implemented" });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};
