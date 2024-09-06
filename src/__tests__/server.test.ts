import { config } from "dotenv";
import { connect } from "mongoose";
import { IncomingMessage, Server, ServerResponse } from "node:http";

import app from "../app";

const TESTING_PORT = 5001;

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

config();

describe("Server", () => {
  afterAll(() => server.close());

  it("Should start the server", async () => {
    await connect(process.env.MONGODB_URL!);

    server = app.listen(TESTING_PORT);

    expect(server).toBeDefined();
  });
});
