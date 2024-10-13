import { config } from "dotenv";

config();

export default {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URL ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  callbackToken: process.env.CALLBACK_TOKEN ?? "",
  jwtSecret: process.env.JWT_SECRET_KEY ?? "",
};
