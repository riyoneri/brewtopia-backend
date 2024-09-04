import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";

import CustomError from "./utils/custom-error";

const app = express();

app.use(helmet());
app.disable("x-powered-by");

app.use(
  (
    error: CustomError,
    _request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    const { message, errors, statusCode } = error;

    response.status(statusCode || 500).json({ message: errors || message });
  },
);

// eslint-disable-next-line no-console
app.listen(5000, () => console.log("Server: http://localhost:5000"));
