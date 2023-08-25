import express, {Request, Response, NextFunction} from 'express';
import logger from "../utils/logger.js";

const router = express.Router();

// middleware that is specific to this router
router.use((_req: Request, _res: Response, next: NextFunction) => {
  logger.info(`Time: ${Date.now().toString()}`)
  next();
})

router.get('/birds', (_req: Request, res: Response) => {
  res.send('Birds home page')
})
// define the about route
router.get('/birds/about', (_req: Request, res:Response) => {
  res.send('About birds')
})

export default router;
