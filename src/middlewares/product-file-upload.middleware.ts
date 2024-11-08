import bb from "busboy";
import { NextFunction, Request, Response } from "express";

import { ServerErrorMessage } from "../constants";
import CustomError from "../utils/custom-error";

export default function productFileUploadMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const busboy = bb({
    headers: request.headers,
    limits: {
      files: 1,
      fileSize: 1024 * 1024 * 3,
    },
  });

  busboy
    .on("file", (name, file, { mimeType }) => {
      try {
        if (name !== "image") {
          file.resume();
        }

        request.body.image = "available";

        if (!["image/jpeg", "image/png", "image/jpg"].includes(mimeType)) {
          request.body.fileError = "The file must jpeg, png or jpg format";

          file.resume();
        }

        const buffers: Uint8Array[] = [];

        file
          .on("limit", () => {
            request.body.fileError = "File is too large. Maximum size is 3MB";

            file.resume();
          })
          .on("data", (chunk) => buffers.push(chunk))
          .on("end", () => (request.body.image = Buffer.concat(buffers)));
      } catch {
        const error = new CustomError(ServerErrorMessage);
        next(error);
      }
    })
    .on(
      "filesLimit",
      () => (request.body.fileError = "Too many files. Maximu is 1 file"),
    )
    .on("field", (name, value) => {
      try {
        request.body[name] = value;
      } catch {
        const error = new CustomError(ServerErrorMessage);

        next(error);
      }
    })
    .on("error", () => {
      const error = new CustomError("Internal server error");

      next(error);
    })
    .on("finish", () => next());

  request.pipe(busboy);
}
