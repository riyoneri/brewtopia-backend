import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";

import { environment } from "../../config";
import {
  ServerErrorMessage,
  ValidationErrorMessage,
  getNotFoundMessage,
} from "../../constants";
import { getProductImageUniqueId, getValidationResult } from "../../helpers";
import getS3Client from "../../helpers/get-s3client";
import { Category, Product } from "../../models";
import CustomError from "../../utils/custom-error";

export const createProduct = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  let imagePath = "";
  const s3 = getS3Client();

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

    imagePath = `products/${getProductImageUniqueId()}.webp`;

    await s3.send(
      new PutObjectCommand({
        Bucket: environment.awsBucketName,
        Body: resizedImage,
        Key: imagePath,
      }),
    );

    const newProductData = new Product({
      name: request.body.name,
      imageUrl: `${environment.awsS3Url}/${imagePath}`,
      price: request.body.price,
      description: request.body.description,
      category: request.body.category,
    });

    const savedProduct = await newProductData.save();

    response.status(201).json(savedProduct.toObject());
  } catch {
    if (imagePath) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: environment.awsBucketName,
          Key: imagePath,
        }),
      );
    }

    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};

export const getAllProducts = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(request.query.page) || undefined;
    const limit = Number(request.query.limit || undefined);
    const skip = page && limit ? (page - 1) * limit : undefined;
    const totalProducts = await Product.countDocuments();

    const products = await Product.find(
      {},
      {},
      { skip, limit, populate: { path: "category", select: "name" } },
    ).transform((document) => document.map((document) => document.toObject()));

    response.status(200).json({ products, total: totalProducts });
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};

export const getSingleProduct = async (
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

    const product = await Product.findOne({ _id: request.params.productId });

    if (!product)
      return response
        .status(404)
        .json({ message: getNotFoundMessage("Product") });

    response.status(200).json(product.toObject());
  } catch {
    const error = new CustomError(ServerErrorMessage);
    next(error);
  }
};
