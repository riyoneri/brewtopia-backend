import compression from "compression";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { debug } from "node:console";
import { RateLimiterMemory } from "rate-limiter-flexible";

import CustomError from "./utils/custom-error";

const app = express();

const rateLimiter = new RateLimiterMemory({
  points: 6,
  duration: 2,
});

app.use(helmet());
app.use(compression());
app.disable("x-powered-by");

if (process.env.NODE_ENV === "development") app.use(morgan("combined"));

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

const server = app.listen(5000, () =>
  // eslint-disable-next-line no-console
  console.log("Server: http://localhost:5000"),
);

process.on("SIGTERM", () => {
  server.close(() => {
    debug("HTTP server closed");
  });
});
