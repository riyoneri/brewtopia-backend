import { config } from "dotenv";

config();

describe("Environment variables", () => {
  test("Should return true if environment variables are available", async () => {
    const MONGODB_URL = process.env.MONGODB_URL;

    expect(MONGODB_URL).toBeTruthy();
  });
});
