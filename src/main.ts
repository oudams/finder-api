import express, { Express } from 'express';
import dotenv from 'dotenv';
import linkedInRoutes from "./routes/linkedInRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import logger from "./utils/logger.js";

dotenv.config();

const main: Express = express();

main.use(linkedInRoutes);
main.use(homeRoutes);

const port = process.env.PORT;
main.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});
