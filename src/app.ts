import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import { config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { connect } from "mongoose";
import morgan from "morgan";
import { debug } from "node:console";
import { exit } from "node:process";
import { RateLimiterMemory } from "rate-limiter-flexible";

import appRouter from "./routes";
import CustomError from "./utils/custom-error";

config();

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000;

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

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use((request: Request, response: Response, next: NextFunction) => {
  rateLimiter
    .consume(request.ip!)
    .then(() => next())
    .catch(() => response.status(429).json({ message: "Too many requests" }));
});

app.use(appRouter);

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

if (MONGODB_URL)
  connect(MONGODB_URL)
    .then(() => {
      const server = app.listen(PORT, () =>
        // eslint-disable-next-line no-console
        console.log(`Server: http://localhost:${5000}`),
      );

      process.on("SIGTERM", () => {
        server.close(() => {
          debug("HTTP server closed");
        });
      });
    })
    // eslint-disable-next-line unicorn/prefer-top-level-await
    .catch(() => exit(1));
else exit(1);
