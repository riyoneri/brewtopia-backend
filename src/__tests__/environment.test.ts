import { config } from "dotenv";

import { environment } from "../config/index";

config();

describe("Environment variables", () => {
  test("Should return true if all environment variables are available", async () => {
    const allTruthy = Object.values(environment).every(Boolean);

    expect(allTruthy).toBe(true);
  });
});
