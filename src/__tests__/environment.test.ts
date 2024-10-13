import { config } from "dotenv";

import { environment } from "../config/index";

config();

describe("Environment variables", () => {
  test("Should return true if environment variables are available", async () => {
    expect(environment.mongoURI && environment.resendApiKey).toBeTruthy();
  });
});
