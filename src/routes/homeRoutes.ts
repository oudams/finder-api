import express, {Request, Response, NextFunction} from 'express';

const router = express.Router();

// middleware that is specific to this router
router.use((_req: Request, _res: Response, next: NextFunction) => {

  console.log(`Home at ${Date.now().toString()}`)
  next();
})

router.get('/', (_req: Request, res: Response) => {
  res.send('Homepage')
})
export default router;
