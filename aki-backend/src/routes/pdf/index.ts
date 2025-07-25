// abgeschottet-ki/aki-backend/src/routes/pdf/index.ts
import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import uploadRouter from './upload';
import readRouter from './read';
import { endpoints } from '../../lib';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    ...header,
    ...endpoints['pdf']
  });
});

router.use('/upload', uploadRouter);
router.use('/read', readRouter);

export default router;
