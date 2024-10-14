import { debug } from "node:console";
import { exit } from "node:process";

import app from "./app";
import { environment } from "./config";
import connectDatabase from "./config/database";
import initializeSocket from "./sockets";

connectDatabase()
  .then(() => {
    const server = app.listen(environment.port, () =>
      // eslint-disable-next-line no-console
      console.log(`Server: http://localhost:${environment.port}`),
    );

    initializeSocket(server);

    process.on("SIGTERM", () => {
      server.close(() => {
        debug("HTTP server closed");
      });
    });
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch(() => exit(1));
