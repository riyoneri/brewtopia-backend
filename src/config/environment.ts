import { config } from "dotenv";

config();

export default {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URL ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  callbackToken: process.env.CALLBACK_TOKEN ?? "",
  jwtSecret: process.env.JWT_SECRET_KEY ?? "",
  awsBucketName: process.env.AWS_BUCKET_NAME ?? "",
  awsRegion: process.env.AWS_REGION ?? "",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
};
