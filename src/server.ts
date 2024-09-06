import { config } from "dotenv";
import { connect } from "mongoose";
import { debug } from "node:console";
import { exit } from "node:process";

import app from "./app";

config();

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000;

config();

if (!MONGODB_URL) exit(1);

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
