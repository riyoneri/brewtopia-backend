import { S3 } from "@aws-sdk/client-s3";

import { environment } from "../config";

export default function getS3Client() {
  return new S3({
    region: environment.awsRegion,
    credentials: {
      accessKeyId: environment.awsAccessKeyId,
      secretAccessKey: environment.awsSecretAccessKey,
    },
  });
}
