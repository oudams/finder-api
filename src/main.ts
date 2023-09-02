import express, { Express } from 'express';
import dotenv from 'dotenv';
import linkedInRoutes from "./routes/linkedInRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import logger from "./utils/logger.js";

import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { SignatureV4 } from "@smithy/signature-v4"
import { Sha256 } from "@aws-crypto/sha256-js";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Redis } from "ioredis"
import { createClient } from 'redis';
dotenv.config();

const main: Express = express();

main.use(linkedInRoutes);
main.use(homeRoutes);

const port = process.env.PORT;
main.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});

logger.info(`profile: ${process.env.AWS_PROFILE}`)


const credentialProvider = fromTemporaryCredentials({
  // // Optional. The master credentials used to get and refresh temporary credentials from AWS STS.
  // // If skipped, it uses the default credential resolved by internal STS client.
  masterCredentials: fromTemporaryCredentials({
    params: { RoleArn: "arn:aws:iam::883979811993:role/pretend-cross-access" },
  }),
  // Required. Options passed to STS AssumeRole operation.
  params: {
    // Required. ARN of role to assume.
    RoleArn: "arn:aws:iam::883979811993:role/cache-role",
    // Optional. An identifier for the assumed role session. If skipped, it generates a random
    // session name with prefix of 'aws-sdk-js-'.
    // RoleSessionName: "aws-sdk-js-cache-999",
    // Optional. The duration, in seconds, of the role session.
    DurationSeconds: 3600,

  },
})

const credentials = await credentialProvider();
const signerInit = {
  service: 'elasticache',
  region: "ap-southeast-2",
  sha256: Sha256,
  credentials: {
    accessKeyId: credentials.accessKeyId ,
    secretAccessKey: credentials.secretAccessKey,
  },
}
const signer = new SignatureV4(signerInit);
const cacheRequest = new HttpRequest({
  query: {
    "Action": "connect",
    "User": "user-01"
  },
  method: "GET",
  protocol: "rediss:",
  port: "6379",
  headers: {
    host: "master.eg-test-redis-test.puc1sv.apse2.cache.amazonaws.com",
  },
  hostname: "master.eg-test-redis-test.puc1sv.apse2.cache.amazonaws.com",
});
const presigningOptions = {
  expiresIn: 900,
  signingDate: new Date(),
};

const signedURI =await signer.presign(cacheRequest,presigningOptions)


logger.info("URI==:")
console.log("PRESIGNED URL: ", formatUrl(signedURI));
logger.info("++================")
console.log(signedURI.query)
logger.info("+++================")
console.log(signedURI.query['X-Amz-Credential'])

// const redis = new Redis("rediss://testuser:mstdammstdammstdam@master.eg-test-redis-test.puc1sv.apse2.cache.amazonaws.com:6380");
const redis = new Redis("rediss://master.eg-test-redis-test.puc1sv.apse2.cache.amazonaws.com:6379", {
  username: 'testuser',
  password: 'mstdammstdammstdam'
});

await redis.set("mykey", "NORMAL-user-inserted-value");
console.log("===============")
logger.info(await redis.get("mykey"))

const redis2 = new Redis(formatUrl(signedURI));
//
await redis2.set("mykey1", "iam-userinserted-value");
console.log("=============== IAM aUTH with IORedis")
logger.info(await redis2.get("mykey1"))
//
const redis3 =await createClient({
  url: formatUrl(signedURI)
})

redis3.connect();
await redis3.set('key', '1');
console.log("=============== IAM aUTH with Redis Client")
console.log("REDIS creatClient ", await redis3.get("key") )
