import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { RateLimiterMemory } from "rate-limiter-flexible";

import { environment } from "./config";
import appRouter from "./routes";
import CustomError from "./utils/custom-error";

const app = express();

const rateLimiter = new RateLimiterMemory({
  points: 6,
  duration: 2,
});

app.use(helmet());
app.use(compression());
app.disable("x-powered-by");
app.use(cors());
app.use(bodyParser.json());

if (environment.nodeEnv === "development") app.use(morgan("dev"));

app.use((request: Request, response: Response, next: NextFunction) => {
  rateLimiter
    .consume(request.ip!)
    .then(() => next())
    .catch(() => response.status(429).json({ message: "Too many requests" }));
});

app.use("/api", appRouter);

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

    response.status(statusCode || 500).json({ message, errors });
  },
);

export default app;
