import { config } from "dotenv";

config();

describe("Environment variables", () => {
  test("Should return true if environment variables are available", async () => {
    const MONGODB_URL = process.env.MONGODB_URL;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    expect(MONGODB_URL && RESEND_API_KEY).toBeTruthy();
  });
});
