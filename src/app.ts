import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { RateLimiterMemory } from "rate-limiter-flexible";

import CustomError from "./utils/custom-error";

const app = express();

const rateLimiter = new RateLimiterMemory({
  points: 6,
  duration: 2,
});

app.use(helmet());
app.disable("x-powered-by");

app.use((request: Request, response: Response, next: NextFunction) => {
  rateLimiter
    .consume(request.ip!)
    .then(() => next())
    .catch(() => response.status(429).json({ message: "Too many requests" }));
});

app.use((_request: Request, response: Response, _next: NextFunction) => {
  response.status(404).json({ message: "URL does not exist" });
});

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
